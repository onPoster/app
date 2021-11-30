
import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { ETHEREUM_PROVIDERS } from '../constants/ethereum'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Goerli]: ETHEREUM_PROVIDERS[ChainId.Goerli],
    [ChainId.Polygon]: ETHEREUM_PROVIDERS[ChainId.Polygon],
    [ChainId.xDai]: ETHEREUM_PROVIDERS[ChainId.xDai],
    [ChainId.Hardhat]: 'http://localhost:8555',
    [ChainId.Localhost]: 'http://localhost:8545',
  },
  supportedChains: [
    ChainId.Goerli,
    ChainId.Polygon,
    ChainId.Localhost,
    ChainId.Hardhat,
  ],
  multicallAddresses: {
    ...MULTICALL_ADDRESSES,
  },
}

const MyApp = ({ Component, pageProps }: AppProps): JSX.Element => {
  return (
    
      <DAppProvider config={config}>
        <ChakraProvider>
          <Component {...pageProps} />
        </ChakraProvider>
      </DAppProvider>
  )
}

export default MyApp
