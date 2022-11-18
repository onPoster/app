import { useLazyQuery } from '@apollo/client'
import {
  Alert,
  AlertIcon,
  Box,
  Skeleton,
  Spinner,
  Text,
  Flex,
} from '@chakra-ui/react'
import { JsonRpcProvider } from '@ethersproject/providers'
import { ChainId } from '@usedapp/core'
import { Dispatch, useEffect } from 'react'
import { Poster as PosterType } from 'Poster/typechain/Poster'
import Poster from 'Poster/artifacts/contracts/Poster.sol/Poster.json'
import { GET_ALL_POSTS_IN_DESCENDING_ORDER } from '../../lib/queries'
import { ActionType } from '../../lib/reducers'
import {
  INFURA_CONFIGURATION,
  JACK_CENSORSHIP_LIST,
  SUBGRAPH_RELOADING_TIME_IN_MS,
} from '../../lib/constants'
import { Contract, ethers, getDefaultProvider } from 'ethers'
import {
  POSTER_CONTRACT_ADDRESS,
  POSTER_DEFAULT_CHAIN_ID,
  POSTER_DEFAULT_NETWORK,
} from '../../constants/poster'
import { PostEntry } from './PostEntry'

type PIP1Post_Reply = {
  posts: string[]
  from: {
    id: string
  }
}

export type PIP1Post = {
  type: 'microblog' | 'unknown'
  text: string
  image?: string
  replyTo?: PIP1Post_Reply
}

export type Post = {
  id: string
  rawContent: string
  action: PIP1Post
}

export const ViewGraph = ({
  getAllPostsNeedsReload,
  isReloadIntervalLoading,
  dispatch,
  isDeveloperModeEnabled,
  chainId,
  library,
  account,
}: {
  getAllPostsNeedsReload: boolean
  isReloadIntervalLoading: boolean
  dispatch: Dispatch<ActionType>
  isDeveloperModeEnabled: boolean
  chainId: ChainId
  library: JsonRpcProvider
  account: string
}): JSX.Element => {
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

  const parsePost = (post: Post): PIP1Post => {
    try {
      const action = post.action
      if ('type' in action && action.type == 'microblog') {
        return action
      } else {
        const parsedPost: PIP1Post = JSON.parse(post.rawContent)
        return parsedPost
      }
    } catch (err) {
      console.error('Error parsing the rawContent of the post.')
      return {
        type: 'unknown',
        text: post.rawContent,
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
          Poster wasn’t able to query the subgraph for some reason. Please check
          the logs.
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
              const { text, type } = parsedPost
              return (
                text &&
                type == 'microblog' && (
                  <PostEntry
                    account={account}
                    chainId={chainId}
                    library={library}
                    from={from}
                    dispatch={dispatch}
                    isDeveloperModeEnabled={isDeveloperModeEnabled}
                    post={post}
                    id={id}
                    timestamp={timestamp}
                  />
                )
              )
            })
          })
      )}
    </>
  )
}
