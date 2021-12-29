import { ChainId } from "@usedapp/core";

export const INFURA_ID = 'b7f7038518824df4bf3011a0e94bc6a8'
export const DEFAULT_IPFS_GATEWAY = 'https://ipfs.infura.io/ipfs/'

export const ETHEREUM_PROVIDERS = {
  [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_ID}`,
  [ChainId.Polygon]: `https://poly-mainnet.gateway.pokt.network/v1/lb/61632ea06019490034d569a2`,
  [ChainId.xDai]: `https://poa-xdai.gateway.pokt.network/v1/lb/61a5ac03fd9f8800392ac701`,
  [ChainId.Hardhat]: 'http://localhost:8545', // Using a different for HH to avoid conflict w/localhost.
}