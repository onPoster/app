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
    NEXT_PUBLIC_POSTER_ENVIRONMENT: process.env.NODE_ENV
  }
}
