import { gql } from '@apollo/client'

export const GETALLPOSTS = gql`
  query GetAllPosts {
    transactions(first: 10, orderBy: blockNumber, orderDirection: desc) {
      id
      timestamp
      blockNumber
      from {
        id
      }
    }
    accounts(first: 10, orderBy: id, orderDirection: desc) {
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