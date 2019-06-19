const path = require('path');
const nodeExternals = require('webpack-node-externals');

const cli = {
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, './lib/cli'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: path.resolve(__dirname, './node_modules/'),
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'cli.js',
    path: path.resolve(__dirname, 'build'),
  },
};

const lib = {
  target: 'node',
  externals: [nodeExternals()],
  entry: path.resolve(__dirname, './lib/index.ts'),
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: path.resolve(__dirname, './node_modules/'),
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
    library: 'migrator',
    libraryTarget: 'umd',
  },
};

module.exports = [cli, lib];
