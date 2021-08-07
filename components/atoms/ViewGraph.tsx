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
import { Dispatch, useEffect } from 'react'
import { GETALLPOSTS } from '../../lib/queries'
import { ActionType } from '../../lib/reducers'
import { ENS } from './ENS'

export const ViewGraph = ({
  getAllPostsNeedsReload,
  isReloadIntervalLoading,
  dispatch,
}: {
  getAllPostsNeedsReload: boolean
  isReloadIntervalLoading: boolean
  dispatch: Dispatch<ActionType>
}): JSX.Element => {
  const [getPosts, { loading, error, data }] = useLazyQuery(GETALLPOSTS, {
    fetchPolicy: "network-only"
  })

  useEffect(() => {
    const loadPosts = () => {
      getPosts()
      dispatch({
        type: 'SET_SUBGRAPH_GETALLPOSTS_RELOAD',
        needsToReloadGetAllPosts: false,
      })
    }
    loadPosts()
  }, [getAllPostsNeedsReload])

  // @TODO Add actual accounts & transactions types
  const accounts = (data && data.accounts) || []

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
      {!loading && !error && accounts.length === 0 ? (
        <Box mt="8">
          <Text>No posts yet, be the first one!</Text>
        </Box>
      ) : (
        accounts.map(({ id, posts }) => {
          return posts.map((post) => (
            <Box key={post.id} mt="8">
              <ENS address={id} />
              <Text>{post.rawContent}</Text>
            </Box>
          ))
        })
      )}
    </>
  )
}
