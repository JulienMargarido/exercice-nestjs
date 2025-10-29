/* eslint-disable @typescript-eslint/no-require-imports */
const { RunScriptWebpackPlugin } = require('run-script-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');
const { merge } = require('webpack-merge');

const commonConfig = (options) => ({
  ...options,
  devtool: 'inline-source-map', // Pour le mode de débug
  optimization: {
    minimize: false,
  },
  plugins: [
    ...options.plugins,
    new webpack.WatchIgnorePlugin({
      paths: [/\.js$/, /\.d\.ts$/],
    }),
    new RunScriptWebpackPlugin({
      name: options.output.filename,
      autoRestart: false,
      nodeArgs: ['--inspect=0.0.0.0:9229'],
    }),
  ],
});

const hmrConfig = (options) => ({
  ...options,
  entry: ['webpack/hot/poll?100', options.entry],
  externals: [
    nodeExternals({
      allowlist: ['webpack/hot/poll?100'],
    }),
  ],
  plugins: [...options.plugins, new webpack.HotModuleReplacementPlugin()],
});

module.exports = (options) => {
  const hmrActive = process.env.WEBPACK_ENV === 'hmr';
  console.log(`Mode dev Webpack${hmrActive ? ' avec Hot Reload' : ''}...`);

  if (hmrActive === true) {
    return merge(hmrConfig(options), commonConfig(options));
  } else {
    return commonConfig(options);
  }
};
