import { useLazyQuery } from '@apollo/client'
import {
  Alert,
  AlertIcon,
  Box,
  Skeleton,
  Spinner,
  Text,
  Flex,
  Link,
  Tag,
} from '@chakra-ui/react'
import { getExplorerTransactionLink, useEthers } from '@usedapp/core'
import { Dispatch, useEffect } from 'react'
import { Poster as PosterType } from 'Poster/typechain/Poster'
import Poster from 'Poster/artifacts/contracts/Poster.sol/Poster.json'
import { format } from 'timeago.js'
import { GET_ALL_POSTS_IN_DESCENDING_ORDER } from '../../lib/queries'
import { ActionType } from '../../lib/reducers'
import { ENS } from './ENS'
import {
  INFURA_CONFIGURATION,
  JACK_CENSORSHIP_LIST,
  SUBGRAPH_RELOADING_TIME_IN_MS,
} from '../../lib/constants'
import { Contract, ethers, getDefaultProvider } from 'ethers'
import { ChatIcon } from '@chakra-ui/icons'
import { createURLFromIPFSHash } from '../../lib/connectors'
import { PosterImage } from './PosterImage'
import {
  POSTER_CONTRACT_ADDRESS,
  POSTER_DEFAULT_CHAIN_ID,
  POSTER_DEFAULT_NETWORK,
} from '../../constants/poster'

type PIP1Post_Reply = {
  posts: string[]
  from: {
    id: string
  }
}

type PIP1Post = {
  type: 'microblog'
  text: string
  image?: string
  replyTo?: PIP1Post_Reply
}

type LegacyPIP1Post = {
  post: PIP1Post
}

type PIP2Post = {
  type: 'microblog'
  from: string
  text: PIP1Post
}

type ParsedPost = {
  content: string
  proxy?: {
    from: string
  }
  image?: string
  replyTo?: PIP1Post_Reply
}

export const ViewGraph = ({
  getAllPostsNeedsReload,
  isReloadIntervalLoading,
  dispatch,
}: {
  getAllPostsNeedsReload: boolean
  isReloadIntervalLoading: boolean
  dispatch: Dispatch<ActionType>
}): JSX.Element => {
  const { chainId, library, account } = useEthers()
  const [getPosts, { loading, error, data }] = useLazyQuery(
    GET_ALL_POSTS_IN_DESCENDING_ORDER,
    {
      fetchPolicy: 'network-only',
      nextFetchPolicy: 'network-only',
    }
  )

  useEffect(() => {
    const loadPosts = () => {
      getPosts()
      dispatch({
        type: 'SET_SUBGRAPH_GETALLPOSTS_RELOAD',
        needsToReloadGetAllPosts: false,
      })
      dispatch({
        type: 'SET_SUBGRAPH_RELOAD_INTERVAL_LOADING',
        isReloadIntervalLoading: false,
      })
    }
    loadPosts()
    const defaultProvider =
      library ||
      getDefaultProvider(POSTER_DEFAULT_NETWORK, INFURA_CONFIGURATION)
    const defaultChainId = chainId || POSTER_DEFAULT_CHAIN_ID

    if (defaultProvider && defaultChainId !== undefined) {
      let interval
      const posterContract = new Contract(
        POSTER_CONTRACT_ADDRESS,
        Poster.abi,
        defaultProvider
      ) as unknown as PosterType

      const delayedEventUpdate = () => {
        dispatch({
          type: 'SET_SUBGRAPH_RELOAD_INTERVAL_LOADING',
          isReloadIntervalLoading: true,
        })
        // Ensuring we are debouncing loadPosts by SUBGRAPH_RELOADING_TIME_IN_MS
        // even if we have multiple events coming at the same time.
        if (!interval) {
          setTimeout(loadPosts, SUBGRAPH_RELOADING_TIME_IN_MS)
        }
      }

      const filter = {
        address: POSTER_CONTRACT_ADDRESS,
        topics: [ethers.utils.id('NewPost(address,string,string)')],
      }

      posterContract.on(filter, delayedEventUpdate)

      return () => {
        posterContract.removeListener(filter, delayedEventUpdate)
        clearTimeout(interval)
      }
    }
  }, [getAllPostsNeedsReload, chainId, library])

  // @TODO Add actual accounts & transactions types
  const transactions = (data && data.transactions) || []

  const parsePost = (post): ParsedPost => {
    try {
      const parsedPost: LegacyPIP1Post | PIP1Post | PIP2Post = JSON.parse(post.rawContent)
      if ('post' in parsedPost) {
        const castedPost = parsedPost as LegacyPIP1Post
        return {
          content: castedPost.post.text,
          image: castedPost.post.image,
          replyTo: castedPost.post.replyTo
        }
      } else if (typeof parsedPost.text == 'object') {
        const castedPost = parsedPost as PIP2Post
        return {
          content: castedPost.text.text,
          proxy: { from: castedPost.from },
          image: castedPost.text.image,
          replyTo: castedPost.text.replyTo,
        }
      } else {
        const castedPost = parsedPost as PIP1Post
        return {
          content: castedPost.text,
          image: castedPost.image,
          replyTo: castedPost.replyTo,
        }
      }
    } catch (err) {
      console.error('Error parsing the posted content.')
      return {
        content: post.action.text,
      }
    }
  }

  return (
    <>
      {isReloadIntervalLoading && (
        <Flex alignContent="center" mt="8">
          <Spinner mr="4" />
          <Text>Loading new posts...</Text>
        </Flex>
      )}
      {loading && <Skeleton />}
      {error && (
        <Alert status="error">
          <AlertIcon />
          Poster wasn’t able to query the subgraph for some reason. Please check the logs.
        </Alert>
      )}
      {!loading && !error && transactions.length === 0 ? (
        <Box mt="8">
          <Text>No posts yet, be the first one!</Text>
        </Box>
      ) : (
        transactions
          .filter(({ from }) => !JACK_CENSORSHIP_LIST.includes(from.id)) // can't have a social network w/o censorship
          .map(({ id, from, posts, timestamp }) => {
            return posts.map((post) => {
              const parsedPost = parsePost(post)
              const { content, proxy, image } = parsedPost
              return (
                content && <Box key={post.id} mt="8">
                  {image && <PosterImage src={createURLFromIPFSHash(image)} />}
                  {/* @TODO Restore replies */ }
                  {/* {replyTo &&
                      replyTo.posts[0] &&
                      replyTo.from && (
                        <Box>
                          <Text fontSize="sm" opacity="0.9">
                            Reply to{' '}
                            {parsePost(post.action.replyTo.posts[0]).content} from{' '}
                            {replyTo.from.id}
                          </Text>
                        </Box>
                      )} */}
                  <Flex alignItems="baseline">
                    <Flex>
                      <ENS props={{ mr: '1' }} address={proxy ? proxy.from : from.id} />·
                      { proxy && <Tag ml="1">Proxied</Tag>}
                      <Link
                        isExternal
                        href={`${getExplorerTransactionLink(
                          id,
                          chainId || POSTER_DEFAULT_CHAIN_ID
                        )}`}
                      >
                        <Text mx="1" fontSize="sm" minW="120px">
                          {format(timestamp * 1000)}
                        </Text>
                      </Link>
                    </Flex>
                  </Flex>
                  <Text>{content}</Text>
                  {account &&
                    false && ( // @TODO: Disabling reply functionality for now.
                      <ChatIcon
                        cursor="pointer"
                        onClick={() => {
                          dispatch({
                            type: 'SET_REPLY_TO_CONTENT',
                            replyToContent: content,
                          })
                          dispatch({
                            type: 'SET_REPLY_TO_CONTENT_ID',
                            replyToContentId: id,
                          })
                        }}
                      />
                    )}
                </Box>
              )
            })
          })
      )}
    </>
  )
}
