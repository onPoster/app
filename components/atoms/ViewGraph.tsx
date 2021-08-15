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
  DEFAULT_CHAIN_ID,
  DEFAULT_NETWORK,
  INFURA_CONFIGURATION,
  JACK_CENSORSHIP_LIST,
  POSTER_CONTRACT_ADDRESS,
  SUBGRAPH_RELOADING_TIME_IN_MS,
} from '../../lib/constants'
import { Contract, ethers, getDefaultProvider } from 'ethers'
import { ChatIcon } from '@chakra-ui/icons'
import { createURLFromIPFSHash } from '../../lib/connectors'
import { PosterImage } from './PosterImage'

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
      library || getDefaultProvider(DEFAULT_NETWORK, INFURA_CONFIGURATION)
    const defaultChainId = chainId || DEFAULT_CHAIN_ID

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
        topics: [ethers.utils.id('NewPost(address,string)')],
      }

      posterContract.on(filter, delayedEventUpdate)

      return () => {
        posterContract.removeListener(filter, delayedEventUpdate)
        clearTimeout(interval)
      }
    }
  }, [getAllPostsNeedsReload, library])

  // @TODO Add actual accounts & transactions types
  const transactions = (data && data.transactions) || []

  const tryClientSideJSONParsing = (rawContent): string => {
    try {
      // NB: Trying to import generated schema (assembly script) to typescript will fail.
      const action: { text: string } = JSON.parse(rawContent)
      return action.text
    } catch {
      return rawContent
    }
  }

  const getPostContent = (post) => post.action.text
  ? post.action.text
  : tryClientSideJSONParsing(post.rawContent)

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
          There was an error processing your request
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
              const postContent = getPostContent(post)
              return (
                <Box key={post.id} mt="8">
                  {post.action.image && <PosterImage src={createURLFromIPFSHash(post.action.image)} />}
                  {post.action.replyTo && post.action.replyTo.posts[0] && post.action.replyTo.from && (
                      <Box>
                        <Text fontSize="sm" opacity="0.9">Reply to {getPostContent(post.action.replyTo.posts[0])} from {post.action.replyTo.from.id}</Text>
                      </Box>
                    )}
                  <Flex alignItems="baseline">
                    <Flex>
                      <ENS props={{ mr: '1' }} address={from.id} />·
                      <Link
                        isExternal
                        href={`${getExplorerTransactionLink(
                          id,
                          chainId || DEFAULT_CHAIN_ID
                        )}`}
                      >
                        <Text mx="1" fontSize="sm" minW="120px">
                          {format(timestamp * 1000)}
                        </Text>
                      </Link>
                    </Flex>
                  </Flex>
                  <Text>{postContent}</Text>
                  {account && (
                    <ChatIcon
                      cursor="pointer"
                      onClick={() => {
                        dispatch({
                          type: 'SET_REPLY_TO_CONTENT',
                          replyToContent: postContent,
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
