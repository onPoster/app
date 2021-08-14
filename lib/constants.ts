import { ChainId } from "@usedapp/core"

export const POSTER_SUBGRAPH_URL_GOERLI = `https://api.thegraph.com/subgraphs/name/jjperezaguinaga/poster-goerli`
export const POSTER_SUBGRAPH_URL_POLYGON = 'https://api.thegraph.com/subgraphs/name/jjperezaguinaga/poster-polygon'

export const POSTER_CONTRACT_ADDRESS = '0x0000000000A84Fe7f5d858c8A22121c975Ff0b42'

// @TODO Fetch these values directly from package
export const POSTER_CONTRACT_VERSION = 'v6'
export const POSTER_APP_VERSION = '0.1.0'

export const INFURA_ID = 'b7f7038518824df4bf3011a0e94bc6a8'
export const PROVIDERS = {
    [ChainId.Goerli]: `https://goerli.infura.io/v3/${INFURA_ID}`,
    [ChainId.Polygon]: `https://polygon-mainnet.infura.io/v3/${INFURA_ID}`,
    [ChainId.Hardhat]: 'http://localhost:8555',
    [ChainId.Localhost]: 'http://localhost:8545',
  }

export const SUBGRAPH_RELOADING_TIME_IN_MS = 5000

export const DEFAULT_CHAIN_ID = ChainId.Goerli
export const DEFAULT_NETWORK = PROVIDERS[DEFAULT_CHAIN_ID]
export const INFURA_CONFIGURATION = { infura: INFURA_ID }

export const JACK_CENSORSHIP_LIST = process.env.NODE_ENV === 'production' ? ['0x900d8f9796cdfb3da852e061985b1ad564199bd8'] : []