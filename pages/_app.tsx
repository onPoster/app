import { ChakraProvider } from '@chakra-ui/react'
import {
  ChainId,
  Config,
  DAppProvider,
  Goerli,
  Hardhat,
  Polygon,
  xDai,
} from '@usedapp/core'
import type { AppProps } from 'next/app'
import React from 'react'
import { ETHEREUM_PROVIDERS } from '../constants/ethereum'

const config: Config = {
  readOnlyUrls: {
    [ChainId.Goerli]: ETHEREUM_PROVIDERS[ChainId.Goerli],
    [ChainId.Polygon]: ETHEREUM_PROVIDERS[ChainId.Polygon],
    [ChainId.xDai]: ETHEREUM_PROVIDERS[ChainId.xDai],
    [ChainId.Hardhat]: ETHEREUM_PROVIDERS[ChainId.Hardhat],
  },
  networks: [
    Goerli,
    Polygon,
    xDai,
    Hardhat,
  ],
  multicallAddresses: {
    [ChainId.Hardhat]: "0xcf7ed3acca5a467e9e704c703e8d87f634fb0fc9"
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
