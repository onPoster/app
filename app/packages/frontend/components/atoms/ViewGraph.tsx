import { gql, useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Text } from '@chakra-ui/react'
import { ENS } from './ENS'

const COMPOUND_MARKETS = gql`
  query GetAllPosts {
    posts(first: 5, orderBy: id, orderDirection: desc) {
      id
      poster
      type
      content
    }
  }
`

export const ViewGraph = (): JSX.Element => {
  const { loading, error, data } = useQuery(COMPOUND_MARKETS)

  return (
    <>
      {loading && (
        <Alert status="warning">
          <AlertIcon />
          ... Loading
        </Alert>
      )}
      {error && (
        <Alert status="error">
          <AlertIcon />
          There was an error processing your request
        </Alert>
      )}
      {!loading &&
        !error &&
        data.posts.map(({ id, poster, type, content }) => (
          <Box key={id} mt="8">
            <ENS address={poster} />
            <Text>{content}</Text>
          </Box>
        ))}
    </>
  )
}
