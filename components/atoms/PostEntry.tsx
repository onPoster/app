import { ChatIcon } from '@chakra-ui/icons'
import { Box, Flex, Link, Tag, Text } from '@chakra-ui/react'
import { ChainId } from '@usedapp/core'
import { Dispatch } from 'react'
import { format } from 'timeago.js'
import { JsonRpcProvider } from '@ethersproject/providers'
import { getChainFromChainId } from '../../constants/ethereum'
import { POSTER_DEFAULT_CHAIN_ID } from '../../constants/poster'
import { createURLFromIPFSHash } from '../../lib/connectors'
import { ActionType } from '../../lib/reducers'
import { ENS } from './ENS'
import { PosterImage } from './PosterImage'
import { PIP1Post, Post } from './ViewGraph'

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

export const PostEntry = ({
  id,
  post,
  from,
  timestamp,
  dispatch,
  chainId,
  library,
  account,
  isDeveloperModeEnabled = false,
}: {
  id: string
  post: any
  from: any
  timestamp: any
  dispatch: Dispatch<ActionType>
  chainId: ChainId
  library: JsonRpcProvider
  account: string
  isDeveloperModeEnabled?: boolean
}): JSX.Element => {
  const parsedPost = parsePost(post)
  const { text, image, type } = parsedPost
  return (
    <Box key={post.id} mt="8">
      {image && <PosterImage src={createURLFromIPFSHash(image)} />}
      {/* @TODO Restore replies */}
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
          <ENS props={{ mr: '1' }} address={from.id} library={library} />
          <Link
            isExternal
            href={getChainFromChainId(
              chainId || POSTER_DEFAULT_CHAIN_ID
            ).getExplorerTransactionLink(id)}
          >
            <Text mx="1" fontSize="sm">
              {format(timestamp * 1000)}
            </Text>
          </Link>
          {isDeveloperModeEnabled && (
            <>
              ·<Tag ml="1">{type}</Tag>{' '}
            </>
          )}
        </Flex>
      </Flex>
      <Text aria-label="Post">{text}</Text>
      {account &&
        false && ( // @TODO: Disabling reply functionality for now.
          <ChatIcon
            cursor="pointer"
            onClick={() => {
              dispatch({
                type: 'SET_REPLY_TO_CONTENT',
                replyToContent: text,
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
}
