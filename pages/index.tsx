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
import { useEthersWithFallback } from '../lib/hooks'

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, chainId, library, fallback, activate, deactivate, activateBrowserWallet } = useEthersWithFallback()
  const currentAccount = state.useFallbackAccount ? fallback.account : account
  const [apolloClient, setApolloClient] = useState()
  const { colorMode } = useColorMode()

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
    <Layout
      account={account}
      chainId={chainId}
      fallback={fallback}
      dispatch={dispatch}
      isDeveloperModeEnabled={state.settingsDeveloper}
      useFallbackAccount={state.useFallbackAccount} 
      activate={activate}
      deactivate={deactivate}
      activateBrowserWallet={activateBrowserWallet}
    >
      <SimpleGrid columns={[1, 1, 1, 1]}>
        <Box
          p="8"
          bg={POSTER_UI_BG_COLOR_MAP.containers[colorMode]}
        >
          <Box>
            {currentAccount && state.replyToContentId && (
              <Text>You are replying to: {state.replyToContent}</Text>
            )}
            {state.previewImageError && (
              <Text>
                Error trying to upload image: {state.previewImageError}
              </Text>
            )}
            <InputGroup size="sm">
              <Textarea
                aria-label='Post content'
                bg={POSTER_UI_BG_COLOR_MAP.textArea[colorMode]}
                color={POSTER_UI_TEXT_COLOR_MAP[colorMode]}
                type="text"
                rows={2}
                cols={10}
                isDisabled={state.isLoading || !currentAccount}
                wrap="soft"
                width="100%"
                style={{ overflow: 'hidden', resize: 'none' }}
                value={state.inputValue}
                placeholder="Post something funny :)"
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
            {currentAccount && state.previewImageCID && (
              <PosterImage src={createURLForCID(state.previewImageCID)} />
            )}
            <Flex alignItems="center" justifyContent="space-between">
              {currentAccount && (
                <AddImage isDisabled={state.isLoading} dispatch={dispatch} />
              )}
              <Button
                aria-label='Submit Post'
                mt="2"
                colorScheme="teal"
                isDisabled={!currentAccount}
                isLoading={state.isLoading}
                onClick={() =>
                  setPostContent(
                    POSTER_CONTRACT_ADDRESS,
                    state,
                    state.useFallbackAccount ? fallback.signer : library.getSigner(),
                    dispatch
                  )
                }
              >
                {currentAccount ? 'Post' : 'Connect wallet to post'}
              </Button>
            </Flex>
          </Box>
        </Box>
        <Box p="5">
          {apolloClient && (
            <ApolloProvider client={apolloClient}>
              <ViewGraph
                account={account}
                chainId={chainId}
                library={library}
                getAllPostsNeedsReload={state.needsToReloadGetAllPosts}
                isReloadIntervalLoading={state.isReloadIntervalLoading}
                dispatch={dispatch}
                isDeveloperModeEnabled={state.settingsDeveloper}
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
