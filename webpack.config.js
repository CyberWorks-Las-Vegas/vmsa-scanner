require('dotenv').config()
const path = require("path");
const webpack = require("webpack");
const WebpackMd5Hash = require("webpack-md5-hash")
const HtmlWebpackPlugin = require("html-webpack-plugin");
const TerserWebpackPlugin = require("terser-webpack-plugin");
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const WebpackManifestPlugin = require('webpack-manifest-plugin');
const { ReactLoadablePlugin } = require('react-loadable/webpack');
const OptimizeCssAssetsPlugin = require("optimize-css-assets-webpack-plugin");




// quickly decides which mode were in based on node env then destructures into object
module.exports = ({ mode } = {
  mode: process.env.NODE_ENV === "production" ?
    "production"
    :
    "development"
}) => {
  // puts current mode into variable
  const isProduction = (mode === "production");
  // webpackmerge will help decide between our prod/dev configs on build and overwrite the correct one
  return {
    // sets mode for current env
    mode,
    // checks for entry for webapck
    entry: {
      main: path.resolve("./src/index.js")
    },
    // output for bundled file
    output: {
      publicPath: "/",
      path: path.resolve("./dist"),
      filename: "index.[hash].js"
    },
    // devServer: {
    //   contentBase: path.join(__dirname, 'dist'),
    //   stats: {
    //     children: false
    //   },
    //   compress: true,
    //   hot: true,
    //   port: 3000
    // },
    devtool: "none",
    resolve: {
      alias: {
        "react-dom": "@hot-loader/react-dom"
      },
      // helps resolve extensions in react
      extensions: ["*", ".js", ".jsx", '.gif', '.png', '.jpg', '.jpeg', '.svg', '.webp']
    },
    optimization: {
      minimize: true,
      splitChunks: {
        chunks: "all",
        minSize: 0,
        maxInitialRequests: 10,
        maxAsyncRequests: 10,
        cacheGroups: {
          vendors: {
            test: /[\\/]node_modules[\\/]/,
            name(module, chunks, cacheGroupKey) {
              const packageName = module.context.match(
                /[\\/]node_modules[\\/](.*?)([\\/]|$)/
              )[1];
              return `${cacheGroupKey}.${packageName.replace("@", "")}`;
            }
          },
          common: {
            minChunks: 2,
            priority: -10
          }
        }
      },
      runtimeChunk: "single"
    },
    module: {
      rules: [
        {
          // FOR BABEL TO TRANSPILE CORRECTLY
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: "babel-loader",
            options: {
              presets: ['@babel/react'],
              cacheDirectory: true,
              cacheCompression: false,
              envName: "production"
            }
          }
        },
        {
          // for loading html files
          test: /\.html$/,
          use: [
            {
              loader: "html-loader",
              options: { minimize: true }
            }
          ]

        },
        {
          // for loading css files
          test: /\.(css)$/,
          use: [
            {
              loader: 'style-loader'
            },
            {
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 1
              }
            }
          ]
        },
        {
          // for loading images/modules
          test: /\.(eot|woff|woff2|ttf)$/i,
          use: {
            loader: "url-loader",
            options: {
              limit: 8192,
              fallback: "file-loader",
              name: "[path][name].[hash].[ext]"
            }
          }
        },
        // for loading/compressing big images
        {
          test: /\.(gif|png|jpe?g|svg|webp)$/i,
          use: [
            'file-loader',
            'webp-loader',
            {
              loader: 'image-webpack-loader',
              options: {
                name: "[path][name].[hash].[ext]",
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: true,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75
                },
              }
            },
          ],
        }
      ]
    },
    plugins: [
      // to keep dist folder clean on rebuild
      new CleanWebpackPlugin(),
      // for html files
      new HtmlWebpackPlugin({
        inject: true,
        hash: true,
        template: "./public/index.html",
        minify: {
          collapseWhitespace: true,
          removeComments: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true,
          useShortDoctype: true
        }
      }),
      // reduces css duplication in bundle
      new OptimizeCssAssetsPlugin({
        assetNameRegExp: /\.css$/g,
        cssProcessor: require('cssnano'),
        cssProcessorPluginOptions: {
          preset: ['default',
            {
              discardComments:
              {
                removeAll: true
              }
            }],
        },
        canPrint: true
      }),
      new TerserWebpackPlugin({
        parallel: true,
        terserOptions: {
          compress: {
            comparisons: false
          },
          mangle: {
            safari10: true
          },
          output: {
            comments: false,
            ascii_only: true
          },
          ecma: 6,
          warnings: false
        }
      }),
      new ReactLoadablePlugin({
        filename: './build/react-loadable.json',
      }),
      // to create manifest.json on build
      new WebpackManifestPlugin(),
      // took keep state on reload in dev server 
      new webpack.HotModuleReplacementPlugin(),
      // for hashing
      new WebpackMd5Hash()
    ]
  };
};
