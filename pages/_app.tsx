
import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  MULTICALL_ADDRESSES,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { INFURA_ID } from '../constants/ethereum'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_ID}`,
    [ChainId.Polygon]: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
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
