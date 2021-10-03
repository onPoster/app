import {
  Box,
  Button,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useColorMode,
  SimpleGrid,
  Flex,
} from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { useEthers } from '@usedapp/core'
import React, { useReducer, useState, useEffect } from 'react'

import { DarkModeSwitch } from '../components/atoms/DarkModeSwitch'
import { ViewGraph } from '../components/atoms/ViewGraph'
import Layout from '../components/layout/Layout'
import { AddImage } from '../components/molecules/AddImage'
import { PosterImage } from '../components/atoms/PosterImage'

import { getApollo } from '../lib/apolloClient'
import { initialState, reducer, setPostContent } from '../lib/reducers'
import { createURLForCID } from '../lib/connectors'

import {
  POSTER_MAX_AMOUNT_OF_CHARACTERS,
  POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP,
  POSTER_DEFAULT_CHAIN_ID,
  POSTER_CONTRACT_ADDRESS,
} from '../constants/poster'
import {
  POSTER_UI_BG_COLOR_MAP,
  POSTER_UI_TEXT_COLOR_MAP,
} from '../constants/ui'

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const {account, chainId, library} = useEthers()
  const [apolloClient, setApolloClient] = useState()
  const {colorMode} = useColorMode()

  useEffect(() => {
    const subgraphURL =
      POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP[
        chainId ? chainId : POSTER_DEFAULT_CHAIN_ID
      ]
    const apolloClient = getApollo(subgraphURL)
    setApolloClient(apolloClient)
    return () => {
      setApolloClient(null)
    }
  }, [chainId])

  const remainingCharacters =
    POSTER_MAX_AMOUNT_OF_CHARACTERS - state.charactersAmount

  return (
    <Layout dispatch={dispatch}>
      <SimpleGrid columns={[1, 1, 1, 2]}>
        <Box
          maxWidth="container.sm"
          p="8"
          bg={POSTER_UI_BG_COLOR_MAP.containers[colorMode]}
        >
          <Box>
            {account && state.replyToContentId && (
              <Text>You are replying to: {state.replyToContent}</Text>
            )}
            <InputGroup size="sm">
              <Textarea
                bg={POSTER_UI_BG_COLOR_MAP.textArea[colorMode]}
                color={POSTER_UI_TEXT_COLOR_MAP[colorMode]}
                type="text"
                rows={10}
                cols={10}
                isDisabled={state.isLoading || !account}
                wrap="soft"
                maxLength={300}
                style={{ overflow: 'hidden', resize: 'none' }}
                value={state.inputValue}
                placeholder="Post something funny."
                onChange={(e) => {
                  dispatch({
                    type: 'SET_CHARACTERS_AMOUNT',
                    charactersAmount: e.target.value.length,
                  })
                  dispatch({
                    type: 'SET_INPUT_VALUE',
                    inputValue: e.target.value,
                  })
                }}
              />
              <InputRightElement>
                <Text
                  color={remainingCharacters < 10 ? 'yellow.500' : 'alphaBlack'}
                >{`${remainingCharacters}`}</Text>
              </InputRightElement>
            </InputGroup>
            {account && state.previewImageCID && (
              <PosterImage src={createURLForCID(state.previewImageCID)} />
            )}
            <Flex alignItems="center" justifyContent="space-between">
              {account && (
                <AddImage isDisabled={state.isLoading} dispatch={dispatch} />
              )}
              <Button
                mt="2"
                colorScheme="teal"
                isDisabled={!account}
                isLoading={state.isLoading}
                onClick={() =>
                  setPostContent(
                    POSTER_CONTRACT_ADDRESS,
                    state,
                    library,
                    dispatch
                  )
                }
              >
                {account ? 'Post' : 'Connect wallet to post'}
              </Button>
            </Flex>
          </Box>
        </Box>
        <Box p="5">
          {apolloClient && (
            <ApolloProvider client={apolloClient}>
              <ViewGraph
                getAllPostsNeedsReload={state.needsToReloadGetAllPosts}
                isReloadIntervalLoading={state.isReloadIntervalLoading}
                dispatch={dispatch}
              />
            </ApolloProvider>
          )}
        </Box>
      </SimpleGrid>
      <DarkModeSwitch />
    </Layout>
  )
}

export default HomeIndex
