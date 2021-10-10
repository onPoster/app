
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
    [ChainId.Polygon]: `https://poly-mainnet.gateway.pokt.network/v1/lb/61632ea06019490034d569a2`,
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
