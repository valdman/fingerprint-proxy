const {DefinePlugin} = require('webpack');
const path = require("path");
const dotenv = require('dotenv').config({path: __dirname + '/.env'});
const nodeExternals = require('webpack-node-externals');

const env = {
  ...process.env,
  ...dotenv.parsed
};

module.exports = {
  entry: {
    server: "./src/index.ts",
    webapp: "./src/webapp/index.tsx",
  },
  plugins: [ new DefinePlugin({
      "process.env": JSON.stringify(env),
  }) ],
  externals: [ nodeExternals() ],
  watch: Boolean(env.WEBPACK_WATCH),
  devtool: "source-map",
  mode: env.ENVIROMENT,
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
  output: {
    filename: "[name].js",
    path: path.resolve(__dirname, "dist"),
  },
};
