import {
  Box,
  Button,
  Heading,
  Tag,
  InputGroup,
  InputRightElement,
  Text,
  Textarea,
  useColorMode,
  SimpleGrid,
} from '@chakra-ui/react'
import {
  ChainId,
  useBlockNumber,
  useEthers,
  useSendTransaction,
} from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useEffect, useReducer, useState } from 'react'
import { DarkModeSwitch } from '../components/atoms/DarkModeSwitch'
import { ViewGraph } from '../components/atoms/ViewGraph'

import Layout from '../components/layout/Layout'
import { initialState, reducer, setPostContent } from '../lib/reducers'

/**
 * Constants & Helpers
 */

const localProvider = new providers.StaticJsonRpcProvider(
  'http://localhost:8555'
)

// Single address across all networks due to Singleton Factory pattern
const POSTER_CONTRACT_ADDRESS = '0xA0c7A49916Ce3ed7dd15871550212fcc7079AD61'
const MAX_AMOUNT_OF_CHARACTERS = 300

const bgColor = {
  containers: { light: 'gray.100', dark: 'gray.900' },
  textArea: { light: 'alphaWhite.100', dark: 'gray.900' },
}
const color = { light: '#414141', dark: 'white' }

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, chainId, library } = useEthers()
  const { colorMode } = useColorMode()
  const block = useBlockNumber()
  const [blockUpdates, setBlockUpdates] = useState<number>(0)

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

  useEffect(() => {
    setBlockUpdates(blockUpdates + 1)
  }, [block])

  return (
    <Layout>
      <Box d="flex" alignItems="baseline">
        <Heading as="h1" mb="8">
          Poster
        </Heading>
        <Text ml="2" fontSize="xl">
          A general purpose social media based on a ridiculously simple smart
          contract
        </Text>
      </Box>
      <Box d="flex" justifyContent="space-between">
        <Box d="flex">
          <Text>Networks Available</Text>
          <Tag ml="2">Goerli</Tag>
        </Box>
        <Box d="flex">
          <Text>New blocks since load</Text>
          <Tag ml="2">{blockUpdates}</Tag>
        </Box>
      </Box>
      <SimpleGrid columns={2}>
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
                isDisabled={state.isLoading}
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
              <InputRightElement
                children={
                  <Text
                    color={
                      remainingCharacters < 10 ? 'yellow.500' : 'alphaBlack'
                    }
                  >{`${remainingCharacters}`}</Text>
                }
              />
            </InputGroup>

            <Button
              mt="2"
              colorScheme="teal"
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
              Post
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
          <ViewGraph />
        </Box>
      </SimpleGrid>
      <DarkModeSwitch />
    </Layout>
  )
}

export default HomeIndex
