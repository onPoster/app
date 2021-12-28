import { ChainId, getChainName } from "@usedapp/core"
import { ETHEREUM_PROVIDERS } from "./ethereum"

const POSTER_SUBGRAPH_URL_GOERLI = `https://api.thegraph.com/subgraphs/name/jjperezaguinaga/poster-goerli`
const POSTER_SUBGRAPH_URL_POLYGON = 'https://api.thegraph.com/subgraphs/name/jjperezaguinaga/poster-polygon'
const POSTER_SUBGRAPH_URL_XDAI = 'https://api.thegraph.com/subgraphs/name/onposter/gnosis'
const POSTER_SUBGRAPH_URL_HARDHAT = 'http://localhost:8000/subgraphs/name/onposter/poster-localhost'

export const POSTER_DEFAULT_CHAIN_ID = +(process.env.NEXT_PUBLIC_POSTER_CHAIN) || ChainId.xDai
export const POSTER_DEFAULT_NETWORK_NAME = getChainName(POSTER_DEFAULT_CHAIN_ID)
export const POSTER_CONTRACT_ADDRESS = '0x000000000000cd17345801aa8147b8D3950260FF'
export const POSTER_ENVIRONMENT = process.env.NEXT_PUBLIC_POSTER_ENVIRONMENT

export const POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP = {
    [ChainId.Goerli]: POSTER_SUBGRAPH_URL_GOERLI,
    [ChainId.Polygon]: POSTER_SUBGRAPH_URL_POLYGON,
    [ChainId.xDai]: POSTER_SUBGRAPH_URL_XDAI,
    [ChainId.Hardhat]: POSTER_SUBGRAPH_URL_HARDHAT
  }
  
export const POSTER_DEFAULT_NETWORK = ETHEREUM_PROVIDERS[POSTER_DEFAULT_CHAIN_ID]
export const POSTER_MAX_AMOUNT_OF_CHARACTERS = 300