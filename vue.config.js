const webpack = require("webpack");

module.exports = {
  chainWebpack: config => {
    config.module.rules.delete("eslint");
  },
  configureWebpack: {
    externals: {
      jquery: "jQuery",
      $: "jQuery",
      google: "google"
    },
    plugins: [
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        google: "google"
      })
    ],
    optimization: {
      splitChunks: false
    },
    module: {
      rules: [
        {
          test: /\.html$/,
          exclude: /node_modules/,
          use: ["html-loader"]
        },
        {
          test: /\.gz$/,
          enforce: "pre",
          use: "gzip-loader"
        }
      ]
    }
  },
  css: {
    extract: false
  }
};
