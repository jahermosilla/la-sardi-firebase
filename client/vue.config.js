module.exports = {
  chainWebpack: config => {
    config
      .plugin('html')
      .tap(args => {
        args[0].title = 'La Sardi';
        return args;
      });
  },

  "transpileDependencies": [
    "vuetify"
  ],

  pwa: {
    themeColor: '#009688',
    name: 'La Sardi',
    assetsVersion: 1
  }
}