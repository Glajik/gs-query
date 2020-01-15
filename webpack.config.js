const LodashModuleReplacementPlugin = require('lodash-webpack-plugin');
// const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const StringReplacePlugin = require('string-replace-webpack-plugin');

module.exports = {
  // mode: 'development',
  mode: 'production',
  entry: {
    query: './src/query.js',
  },
  output: {
    library: '[name]',
    libraryExport: 'default',
    libraryTarget: 'var',
    globalObject: 'this',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: StringReplacePlugin.replace({
            replacements: [
              {
                pattern: /\.default/g,
                replacement: () => "['default']",
              },
              {
                pattern: /default: obj/g,
                replacement: () => "'default': obj",
              },
            ],
          }),
        },
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: ['lodash'],
            presets: [['@babel/preset-env', { modules: false }]],
          },
        },
      },
      {
        enforce: 'pre',
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
      },
    ],
  },
  plugins: [
    new StringReplacePlugin(),
    new LodashModuleReplacementPlugin(),
  ],
  optimization: {
    minimize: false,
  },
};
