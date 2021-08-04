module.exports = {
  assetPrefix: './',
  exportTrailingSlash: true,
  exportPathMap: function () {
    return {
      '/': { page: '/' },
    }
  },
}
