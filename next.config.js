module.exports = {
  assetPrefix: './',
  trailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
  env: {
    NEXT_PUBLIC_POSTER_APP_VERSION: process.env.POSTER_APP_VERSION
  }
}
