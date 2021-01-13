module.exports = {
  lintOnSave: false,
  transpileDependencies: [
    'vuetify',
  ],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        asar: false,
      },
      nodeIntegration: true,
    },
  },
};
