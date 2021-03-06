const { DefinePlugin } = require("webpack");
const path = require("path");
const dotenv = require("dotenv").config({ path: __dirname + "/.env" });
const nodeExternals = require("webpack-node-externals");

const env = {
  ...process.env,
  ...dotenv.parsed,
};

const mode = env.ENVIROMENT;

const commonSettings = {
  plugins: [
    new DefinePlugin({
      "process.env": JSON.stringify(env),
    }),
  ],
  devtool: "source-map",
  mode,
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
};

const serverConfig = {
  ...commonSettings,
  name: "server",
  entry: "./src/index.ts",
  target: 'node',
  node: {
      __dirname: false
  },
  externals: [nodeExternals()],
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist"),
  },
};

const webappConfig = {
  ...commonSettings,
  name: "webapp",
  entry: "./src/webapp/index.tsx",
  output: {
    filename: "index.js",
    path: path.resolve(__dirname, "dist", "webapp"),
  },
};

module.exports = [serverConfig, webappConfig];
