module.exports = {
  assetPrefix: './',
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
  env: {
    NEXT_PUBLIC_POSTER_APP_VERSION: process.env.POSTER_APP_VERSION,
    NEXT_PUBLIC_POSTER_CHAIN: process.env.POSTER_CHAIN,
    NEXT_PUBLIC_POSTER_ENVIRONMENT: process.env.NODE_ENV,
    NEXT_PUBLIC_GITPOD_SUBGRAPH_URL: process.env.GITPOD_SUBGRAPH_URL,
    NEXT_PUBLIC_GITPOD_ETHEREUM_NODE_URL: process.env.GITPOD_ETHEREUM_NODE_URL,
    NEXT_PUBLIC_GITPOD_IPFS_API_URL: process.env.GITPOD_IPFS_API_URL,
    NEXT_PUBLIC_GITPOD_IPFS_GATEWAY_URL: process.env.GITPOD_IPFS_GATEWAY_URL
  }
}
