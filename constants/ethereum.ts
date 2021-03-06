import { ChainId, Goerli, xDai, Polygon, Hardhat, Chain } from '@usedapp/core'

export const INFURA_ID = 'b7f7038518824df4bf3011a0e94bc6a8'
export const DEFAULT_IPFS_API =
  process.env.NEXT_PUBLIC_GITPOD_IPFS_API_URL ||
  (process.env.NODE_ENV != 'production'
    ? 'http://localhost:5001'
    : 'https://ipfs.infura.io:5001')
export const DEFAULT_IPFS_GATEWAY =
  process.env.NEXT_PUBLIC_GITPOD_IPFS_GATEWAY_URL ||
  (process.env.NODE_ENV != 'production'
    ? 'http://localhost:8080'
    : 'https://ipfs.infura.io')

export const ETHEREUM_PROVIDERS = {
  [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_ID}`,
  [ChainId.Polygon]: `https://poly-mainnet.gateway.pokt.network/v1/lb/61632ea06019490034d569a2`,
  [ChainId.xDai]: `https://poa-xdai.gateway.pokt.network/v1/lb/61a5ac03fd9f8800392ac701`,
  [ChainId.Hardhat]: 'http://localhost:8545', // Using a different for HH to avoid conflict w/localhost.
}

export const SUPPORTED_CHAINS = {
  [ChainId.xDai]: xDai,
  [ChainId.Polygon]: Polygon,
  [ChainId.Goerli]: Goerli,
  [ChainId.Hardhat]: Hardhat
}

export const getChainFromChainId = (chainId: ChainId): Chain => SUPPORTED_CHAINS[chainId];