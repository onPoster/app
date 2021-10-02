import { INFURA_ID } from "../constants/ethereum"

// @TODO Fetch these values directly from package
export const POSTER_CONTRACT_VERSION = 'v6'
export const POSTER_APP_VERSION = '0.1.0'

// NB: Since the application is entirely client side, it makes not much
// sense to hide it as an environment variable.
// @TODO Move to env for making harder for bots to crawl ids from source code

export const SUBGRAPH_RELOADING_TIME_IN_MS = 5000
export const INFURA_CONFIGURATION = { infura: INFURA_ID }
export const JACK_CENSORSHIP_LIST = process.env.NODE_ENV === 'production' ? ['0x900d8f9796cdfb3da852e061985b1ad564199bd8'] : []