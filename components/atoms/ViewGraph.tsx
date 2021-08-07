import { gql, useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Skeleton, Text } from '@chakra-ui/react'
import { ENS } from './ENS'

const GETALLPOSTS = gql`
  query GetAllPosts {
    transactions(first: 5, orderBy: blockNumber, orderDirection: desc) {
      id
      timestamp
      blockNumber
      from {
        id
      }
    }
    accounts(first: 5, orderBy: id, orderDirection: desc) {
      id
      transactions {
        id
      }
      posts {
        id
        rawContent
      }
    }
  }
`

export const ViewGraph = (): JSX.Element => {
  const { loading, error, data } = useQuery(GETALLPOSTS)
  const accounts = (data && data.accounts) || []

  return (
    <>
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
