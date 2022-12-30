// Generated using webpack-cli https://github.com/webpack/webpack-cli

const path = require("path");
const webpack = require("webpack");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const isProduction = process.env.NODE_ENV == "production";

module.exports = (env, argv) => {
  return {
    entry: "./src/shell/index.ts",
    output: {
      path: isProduction
        ? path.resolve(
            __dirname,
            `dist/_builds/${
              env.build ??
              (() => {
                throw new Error(
                  "Production builds require a build directory. --env build=potato"
                );
              })()
            }`
          )
        : path.resolve(__dirname, "dist"),
    },
    mode: isProduction ? "production" : "development",
    devServer: {
      open: true,
      host: "localhost",
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: "./src/shell/index.html",
      }),

      new webpack.DefinePlugin({
        "process.env.BUILD": JSON.stringify(env.build),
        "process.env.PUBLIC_PATH": '"production"',
      }),

      isProduction && new MiniCssExtractPlugin(),

      // Add your plugins here
      // Learn more about plugins from https://webpack.js.org/configuration/plugins/
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

        // Add your rules for custom modules here
        // Learn more about loaders from https://webpack.js.org/loaders/
      ],
    },
    resolve: {
      extensions: [".tsx", ".ts", ".jsx", ".js", "..."],
    },
  };
};
