const CaseSensitivePathsPlugin = require("case-sensitive-paths-webpack-plugin");
const chalk = require("chalk");
const CleanPlugin = require("clean-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const FriendlyErrorsPlugin = require("friendly-errors-webpack-plugin");
const HtmlPlugin = require("html-webpack-plugin");
const ip = require("ip");
const path = require("path");
const webpack = require("webpack");
const app = require("../package.json");
const paths = require("./paths");

const port = 1234;
const localUrl = `http://localhost:${port}`;
const networkUrl = `http://${ip.address()}:${port}`;

module.exports = {
  mode: "development",
  output: {
    devtoolModuleFilenameTemplate(info) {
      return path.resolve(info.absoluteResourcePath).replace(/\\/g, "/");
    },
    filename: "js/[name].js",
    path: paths.distFolder,
    pathinfo: true,
    publicPath: "/",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: "thread-loader",
            options: {
              poolTimeout: Infinity,
            },
          },
          "babel-loader",
        ],
        include: [paths.srcFolder],
      },
      {
        test: /\.svg$/,
        use: ["@svgr/webpack"],
        include: [paths.srcFolder],
      },
    ],
    strictExportPresence: true,
  },
  plugins: [
    new CaseSensitivePathsPlugin(),
    new CleanPlugin([paths.distFolder], {
      root: paths.rootFolder,
      verbose: false,
    }),
    new CopyPlugin([
      {
        from: paths.staticFolder,
        to: paths.distFolder,
        ignore: ["index.html"],
      },
    ]),
    new FriendlyErrorsPlugin({
      compilationSuccessInfo: {
        messages: [
          [
            `You can now view ${chalk.bold(app.name)} in the browser.\n`,
            `\t${chalk.bold("Local:")} ${chalk.blue(localUrl)}`,
            `\t${chalk.bold("On your network:")} ${chalk.blue(networkUrl)}`,
          ].join("\n"),
        ],
        notes: [
          [
            "Note that the development build is not optimized.",
            `    To create a production build, use ${chalk.cyan(
              "yarn build",
            )}.`,
          ].join("\n"),
        ],
      },
    }),
    new HtmlPlugin({
      template: paths.htmlFile,
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
  devServer: {
    clientLogLevel: "none",
    compress: true,
    contentBase: paths.staticFolder,
    historyApiFallback: true,
    host: "0.0.0.0",
    hot: true,
    overlay: {
      warnings: true,
      errors: true,
    },
    port,
    publicPath: "/",
    quiet: true,
    watchContentBase: true,
  },
  devtool: "cheap-module-source-map",
};
