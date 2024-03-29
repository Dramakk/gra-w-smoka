const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyPlugin = require("copy-webpack-plugin");
const webpack = require("webpack");
require("dotenv").config({ path: "./.env" });

module.exports = {
  mode: "development",
  devtool: "inline-source-map",
  entry: {
    index: path.join(__dirname, "index.tsx"),
  },
  target: "web",
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: "/node_modules/",
      },
      {
        test: /\.(scss|css)$/i,
        use: ["style-loader", "css-loader", "postcss-loader", "sass-loader"],
        exclude: "/node_modules/",
      },
      {
        test: /\.(png|jp(e*)g|svg|gif)$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "images/",
            },
          },
        ],
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        use: [
          {
            loader: "file-loader",
            options: {
              name: "[name].[ext]",
              outputPath: "fonts/",
            },
          },
        ],
      },
    ],
  },
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
    publicPath: `${process.env.BASENAME}/`,
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        { from: path.resolve(__dirname, "levelConfigs") },
        { from: path.resolve(__dirname, "assets") },
      ],
    }),
    new webpack.DefinePlugin({
      BASENAME: JSON.stringify(process.env.BASENAME),
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: path.join(__dirname, "index.html"),
    }),
  ],
};
