// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const webpack = require("webpack");
const { merge } = require("webpack-merge");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { ModuleFederationPlugin } = webpack.container;

const isProduction = process.env.NODE_ENV == "production";

const createBaseConfig = ({ build }) => ({
  mode: isProduction ? "production" : "development",
  devServer: {
    open: false,
    host: "localhost",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.BUILD": JSON.stringify(build),
      "process.env.PUBLIC_PATH": '"???"',
    }),

    isProduction && new MiniCssExtractPlugin(),
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

const createShellConfig = ({ build }) => ({
  entry: "./src/shell/index.ts",
  output: {
    path: path.resolve(__dirname, `dist/shell/_builds/${build}`)
  },
  devServer: {
    port: 8000,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/shell/index.html",
    }),

    new ModuleFederationPlugin({
      name: "beefBurritoShell",
      remotes: {
        beefBurritoPotato: "beefBurritoPotato@http://localhost:8001/remoteEntry.js",
      },
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
      name: "beefBurritoPotato",
      filename: 'remoteEntry.js',
      exposes: {
        "./App": "./src/potato/app.ts",
      },
    }),
  ].filter(Boolean),
});

module.exports = (env, argv) => {
    const application = env.app ?? (() => {
        throw new Error(
            "Webpack requires an application reference. --env app=shell"
          );
    })();

  const build = !isProduction
    ? "local"
    : env.build ??
      (() => {
        throw new Error(
          "Production builds require a build directory. --env build=foo"
        );
      })();


  return {
    shell: () => merge(createBaseConfig({ build }), createShellConfig({ build })),
    potato: () => merge(createBaseConfig({ build }), createPotatoConfig({ build })),
  }[application]?.() ?? (() => {
    throw new Error("Cannot find Webpack config for application reference")
  })();
};
