import { Box, Button, Heading, Input, Text } from '@chakra-ui/react'
import { ChainId, useEthers, useSendTransaction } from '@usedapp/core'
import { ethers, providers, utils } from 'ethers'
import React, { useReducer } from 'react'

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

function HomeIndex(): JSX.Element {
  const [state, dispatch] = useReducer(reducer, initialState)
  const { account, chainId, library } = useEthers()

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

  return (
    <Layout>
      <Heading as="h1" mb="8">
        Poster
      </Heading>
      <Text mt="8" fontSize="xl">
        A general purpose social media based on a ridiculously simple smart
        contract (available only in Görli atm)
      </Text>
      <Box maxWidth="container.sm" p="8" mt="8" bg="gray.100">
        <Box>
          <Input
            bg="white"
            type="text"
            value={state.inputValue}
            placeholder="Post something funny"
            onChange={(e) => {
              dispatch({
                type: 'SET_INPUT_VALUE',
                inputValue: e.target.value,
              })
            }}
          />
          <Button
            mt="2"
            colorScheme="teal"
            isLoading={state.isLoading}
            onClick={() =>
              setPostContent(POSTER_CONTRACT_ADDRESS, state, library, dispatch)
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
    </Layout>
  )
}

export default HomeIndex
