// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("node:path");
const util = require("node:util");
const exec = util.promisify(require("node:child_process").exec);
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const { ModuleFederationPlugin } = webpack.container;

const isProduction = process.env.NODE_ENV == "production";

const getConfig = () =>
  fetch("https://config.beef-burrito.devon.pizza/").then((response) =>
    response.json()
  );

const createBaseConfig = ({ build, mode, publicPath }) => ({
  mode,
  output: {
    publicPath,
  },
  devServer: {
    open: false,
    host: "localhost",
    // https: true,
    allowedHosts: [".beef-burrito.devon.pizza"],
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.BUILD": JSON.stringify(build),
      "process.env.PUBLIC_PATH": JSON.stringify(publicPath),
      "process.env.MODE": JSON.stringify(mode),
    }),

    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    isProduction && new MiniCssExtractPlugin(),

    new CopyPlugin({
      patterns: ["./src/favicon.png"],
    }),
  ].filter(Boolean),
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/i,
        loader: "ts-loader",
        exclude: ["/node_modules/"],
      },
      {
        test: /\.css$/i,
        use: [
          isProduction ? MiniCssExtractPlugin.loader : "style-loader",
          "css-loader",
        ].filter(Boolean),
      },
      {
        test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif)$/i,
        type: "asset",
      },
    ],
  },
  resolve: {
    extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
  },
});

const createShellConfig = ({ build, remotes }) => ({
  entry: "./src/shell/index.ts",
  output: {
    path: path.resolve(__dirname, `dist/shell/_builds/${build}`),
  },
  devServer: {
    port: 8000,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "shell",
      // @example
      // remotes: {
      //     potato: "potato@http://localhost:8001/remoteEntry.js",
      // },
      remotes: Object.entries(remotes).reduce(
        (acc, [key, value]) => ({
          ...acc,
          [key]: `${key}@${value}`,
        }),
        {}
      ),
    }),
  ].filter(Boolean),
});

const createPotatoConfig = ({ build }) => ({
  entry: "./src/potato/index.ts",
  output: {
    path: path.resolve(__dirname, `dist/potato/_builds/${build}`),
  },
  devServer: {
    port: 8001,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "potato",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/potato/remoteEntry.ts",
      },
    }),
  ].filter(Boolean),
});

const createComposerConfig = ({ build }) => ({
  entry: "./src/composer/index.tsx",
  output: {
    path: path.resolve(__dirname, `dist/composer/_builds/${build}`),
  },
  devServer: {
    port: 8002,
  },
  plugins: [
    new ModuleFederationPlugin({
      name: "composer",
      filename: "remoteEntry.js",
      exposes: {
        "./App": "./src/composer/remoteEntry.ts",
      },
    }),
  ].filter(Boolean),
});

module.exports = async (env, argv) => {
  const config = await getConfig();

  console.log("> webpack:config: ", JSON.stringify(config, null, 2));

  const application =
    env.app ??
    (() => {
      throw new Error(
        "Webpack requires an application reference. --env app=shell"
      );
    })();

  console.log("> webpack:application: ", application);

  // Create URL friendly version of the current Git branch.
  //
  // @example
  // + Before: "feature/foo#bar"
  // + After: "feature-foo-bar"
  //
  // @example
  // + Before: "release/1.2.3#foo"
  // + After: "release-1-2-3-foo"
  const build =
    env.build ??
    (await exec("git branch --show-current")).stdout.trim().replace(/\W/g, "-");

  console.log("> webpack:build: ", build);

  const mode = isProduction ? "production" : "development";

  // const publicPath = "https://" + config[application].environment.production.host +  "/";
  const publicPath =
    (isProduction ? "https" : "http") +
    "://" +
    config[application].environment[mode].host +
    "/";

  const createRemote = (target) =>
    "https://" + config[target].environment.production.host + "/remoteEntry.js";

  console.log("> webpack:publicPath: ", publicPath);

  return (
    {
      shell: () =>
        merge(
          createBaseConfig({ build, mode, publicPath }),
          createShellConfig({
            build,
            remotes: {
              potato: createRemote("potato"),
            },
          })
        ),
      potato: () =>
        merge(
          createBaseConfig({ build, mode, publicPath }),
          createPotatoConfig({ build })
        ),
      composer: () =>
        merge(
          createBaseConfig({ build, mode, publicPath }),
          createComposerConfig({ build })
        ),
    }[application]?.() ??
    (() => {
      throw new Error("Cannot find Webpack config for application reference");
    })()
  );
};
