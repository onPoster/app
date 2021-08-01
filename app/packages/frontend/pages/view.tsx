import { gql, useQuery } from '@apollo/client'
import { Alert, AlertIcon, Box, Heading, Text } from '@chakra-ui/react'
import Layout from '../components/layout/Layout'

const COMPOUND_MARKETS = gql`
  query GetAllPosts {
    posts(first: 5) {
      id
      poster
      type
      content
    }
  }
`

function GraphExampleIndex(): JSX.Element {
  const { loading, error, data } = useQuery(COMPOUND_MARKETS)

  return (
    <Layout>
      <Heading as="h1" mb="12">
        View your tweets
      </Heading>
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
        data.posts.map(
          ({ id, poster, type, content }) => (
            <Box key={id} mt="8">
              <Text>Poster: {poster}</Text>
              <Text>Type: {type}</Text>
              <Text>Content: {content}</Text>
            </Box>
          )
        )}
    </Layout>
  )
}

export default GraphExampleIndex
