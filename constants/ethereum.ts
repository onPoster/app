import { ChainId } from "@usedapp/core";

export const INFURA_ID = 'b7f7038518824df4bf3011a0e94bc6a8'
export const DEFAULT_IPFS_GATEWAY = 'https://ipfs.infura.io/ipfs/'

export const ETHEREUM_PROVIDERS = {
  [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_ID}`,
  [ChainId.Polygon]: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
  [ChainId.Hardhat]: 'http://localhost:8555',
  [ChainId.Localhost]: 'http://localhost:8545',
}