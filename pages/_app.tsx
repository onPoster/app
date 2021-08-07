import { ApolloProvider } from '@apollo/client'
import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { useApollo } from '../lib/apolloClient'

export const INFURA_ID = 'b7f7038518824df4bf3011a0e94bc6a8'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: 'http://localhost:8555',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [
    ChainId.Goerli,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
  },
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  const apolloClient = useApollo(pageProps)
  return (
    <ApolloProvider client={apolloClient}>
      <DAppProvider config={config}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </DAppProvider>
    </ApolloProvider>
  )
}

export default MyApp
