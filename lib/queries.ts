import { gql } from '@apollo/client'

export const GET_ALL_POSTS_IN_DESCENDING_ORDER = gql`
  query getAllPostsInDescendingOrder {
    transactions(first: 100, orderBy: blockNumber, orderDirection: desc) {
      id
      timestamp
      blockNumber
      from {
        id
      }
    	posts {
        id
        rawContent
        action {
          type
          text
        }
      }
    }
  }
`