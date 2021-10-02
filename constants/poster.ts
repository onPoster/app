import { ChainId } from "@usedapp/core"
import { ETHEREUM_PROVIDERS } from "./ethereum"

const POSTER_SUBGRAPH_URL_GOERLI = `https://api.thegraph.com/subgraphs/name/jjperezaguinaga/poster-goerli`
const POSTER_SUBGRAPH_URL_POLYGON = 'https://api.thegraph.com/subgraphs/name/jjperezaguinaga/poster-polygon'

export const POSTER_DEFAULT_CHAIN_ID = ChainId.Goerli
export const POSTER_CONTRACT_ADDRESS = '0x0000000000A84Fe7f5d858c8A22121c975Ff0b42'

export const POSTER_SUBGRAPH_URLS_BY_CHAIN_ID_MAP = {
    [ChainId.Goerli]: POSTER_SUBGRAPH_URL_GOERLI,
    [ChainId.Polygon]: POSTER_SUBGRAPH_URL_POLYGON,
  }
  
export const POSTER_DEFAULT_NETWORK = ETHEREUM_PROVIDERS[POSTER_DEFAULT_CHAIN_ID]
export const POSTER_MAX_AMOUNT_OF_CHARACTERS = 300