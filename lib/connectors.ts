import { ChainId } from '@usedapp/core';
import { WalletConnectConnector } from '@web3-react/walletconnect-connector'
import { DEFAULT_IPFS_GATEWAY } from '../constants/ethereum';
const IpfsHttpClient = require('ipfs-http-client');

const POLLING_INTERVAL = 12000
const RPC_URLS: { [chainId: number]: string } = {
  [ChainId.Polygon]: 'https://poly-mainnet.gateway.pokt.network/v1/lb/61632ea06019490034d569a2',
  [ChainId.Goerli]: 'https://goerli.infura.io/v3/84842078b09946638c03157f83405213',
}
export const walletconnect = new WalletConnectConnector({
  rpc: { [ChainId.Polygon]: RPC_URLS[ChainId.Polygon], [ChainId.Goerli]: RPC_URLS[ChainId.Goerli] },
  qrcode: true,
  pollingInterval: POLLING_INTERVAL,
})

export const createClient = (): typeof IpfsHttpClient => {
  return new IpfsHttpClient(
    new URL('https://ipfs.infura.io:5001/api/v0'),
  );
}

export const createURLForCID = (cid: string): string => {
  return `${DEFAULT_IPFS_GATEWAY}${cid}`
}

export const createURLFromIPFSHash = (ipfsHash: string): string => {
  return `${DEFAULT_IPFS_GATEWAY}${ipfsHash.split('://')[1]}`
}