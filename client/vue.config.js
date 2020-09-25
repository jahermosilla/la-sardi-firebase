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
  ]
}