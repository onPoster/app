import {
  Box,
  Button,
  Tag,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useColorMode,
  SimpleGrid,
  Link,
} from '@chakra-ui/react'
import { ApolloProvider } from '@apollo/client'
import { getApollo } from '../lib/apolloClient'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { ExternalLinkIcon } from '@chakra-ui/icons'
import { providers, utils } from 'ethers'
import React, { useReducer, useState } from 'react'

import { DarkModeSwitch } from '../components/atoms/DarkModeSwitch'
import { GitHubIcon } from '../components/atoms/GitHubIcon'
import { ViewGraph } from '../components/atoms/ViewGraph'

import Layout from '../components/layout/Layout'
import { initialState, reducer, setPostContent } from '../lib/reducers'
import {
  DEFAULT_CHAIN_ID,
  POSTER_CONTRACT_ADDRESS,
  POSTER_SUBGRAPH_URL_GOERLI,
  POSTER_SUBGRAPH_URL_POLYGON,
} from '../lib/constants'
import { useEffect } from 'react'

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8555'
)

const MAX_AMOUNT_OF_CHARACTERS = 300

const bgColor = {
  containers: { light: 'gray.100', dark: 'gray.900' },
  textArea: { light: 'alphaWhite.100', dark: 'gray.900' },
}
const color = { light: '#414141', dark: 'white' }

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, chainId, library } = useEthers()
  const [apolloClient, setApolloClient] = useState()

  const subgraphURLsPerNetwork = {
    [ChainId.Goerli]: POSTER_SUBGRAPH_URL_GOERLI,
    [ChainId.Polygon]: POSTER_SUBGRAPH_URL_POLYGON
  }

  useEffect(() => {
    const subgraphURL = subgraphURLsPerNetwork[chainId ? chainId : DEFAULT_CHAIN_ID]
    const apolloClient = getApollo(subgraphURL)
    setApolloClient(apolloClient)
    return(() => {
      setApolloClient(null)
    })
  }, [chainId])

  const { colorMode } = useColorMode()

  const remainingCharacters = MAX_AMOUNT_OF_CHARACTERS - state.charactersAmount

  const isLocalChain =
    chainId === ChainId.Localhost || chainId === ChainId.Hardhat

  // Use the localProvider as the signer to send ETH to our wallet
  const { sendTransaction } = useSendTransaction({
    signer: localProvider.getSigner(),
  })

  function sendFunds(): void {
    sendTransaction({
      to: account,
      value: utils.parseEther('0.1'),
    })
  }

  const colorScheme = {
    online: 'green',
    offline: 'gray',
  }

  return (
    <Layout>
      <Box d="flex" justifyContent="space-between">
        <Box d="flex">
          <Text>Networks Available</Text>
          <Tag ml="2" colorScheme={colorScheme[chainId === 5 ? 'online' : 'offline']}>Goerli</Tag>
          <Tag ml="2" colorScheme={colorScheme[chainId === 137 ? 'online' : 'offline']}>Polygon</Tag>
        </Box>
        <Box d="flex" alignItems="center">
          <GitHubIcon />
          <Link
            mx="2"
            href="https://github.com/ETHPoster/app/issues/new"
            isExternal
          >
            Suggest feature
          </Link>
          <ExternalLinkIcon />
        </Box>
      </Box>
      <SimpleGrid columns={[1, 1, 1, 2]}>
        <Box
          maxWidth="container.sm"
          p="8"
          mt="8"
          bg={bgColor.containers[colorMode]}
        >
          <Box>
            <InputGroup size="sm">
              <Textarea
                bg={bgColor.textArea[colorMode]}
                color={color[colorMode]}
                type="text"
                rows={10}
                cols={10}
                isDisabled={state.isLoading || !account}
                wrap="soft"
                maxLength={300}
                style={{ overflow: 'hidden', resize: 'none' }}
                value={state.inputValue}
                placeholder="Post something funny"
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
          </Box>
          {chainId === 31337 && (
            <Box mt="20px">
              <Text mb="4">This button only works on a Local Chain.</Text>
              <Button
                colorScheme="teal"
                onClick={sendFunds}
                isDisabled={!isLocalChain}
              >
                Send Funds From Local Hardhat Chain
              </Button>
            </Box>
          )}
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
