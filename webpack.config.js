const webpack = require("webpack");
const path = require("path");
const nodeExternals = require('webpack-node-externals');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const { web } = require("webpack");
const CopyPlugin = require("copy-webpack-plugin");

const tsConfig = {
    // externals: [ nodeExternals() ],
    watch: true,
    target:"web",
    mode: 'development',
    entry: {
        main: "./src/index.ts",
        test:"./Test/index.tsx"
    },
    devServer: {
        allowedHosts: 'all',
        headers:{
            "Access-Control-Allow-Origin": "*"
        },
        static: {
          directory: path.join(__dirname, 'dist'),
        },
        compress: true,
        port: 9001,
      },
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, './dist'),
        globalObject: 'self',
        publicPath: '',
        filename: '[name].alterspective.materialdesignforK2.js',
        library: {
            name: '[name]_alterspective_materialdesignforK2',
            type: 'window',
            umdNamedDefine: true,
        },
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
        fallback: {
            timers: require.resolve("timers-browserify"),
            stream: require.resolve("stream-browserify"),
            buffer: require.resolve("buffer"),
        },
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()],
      },
      
    module: {
        rules: [{
                test: /\.tsx?$/,
                loader: "ts-loader",
                exclude: /node_modules/,
            },
            {
                test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
                // More information here https://webpack.js.org/guides/asset-modules/
                type: "asset/inline",
            },
            // {
            //     test: /\.(sa|sc|c)ss$/i,
            //     use: [{
            //             loader: "style-loader",
            //             options: {
            //                 injectType: "lazyStyleTag",
            //                 // Do not forget that this code will be used in the browser and
            //                 // not all browsers support latest ECMA features like `let`, `const`, `arrow function expression` and etc,
            //                 // we recommend use only ECMA 5 features,
            //                 // but it is depends what browsers you want to support
            //                 insert: function insertIntoTarget(element, options) {
            //                     var parent = options.target || document.head;
            //                     var id = options.id || "as-not-set"
            //                     element.id = id //important for webcomponents styling 
            //                     parent.appendChild(element);
            //                 },
            //             },
            //         },

                    
            //        "css-loader",
            //        "postcss-loader",   
            //         "sass-loader",

            //     ]
            // },   
            // {
            //     test: /\.css$/i, // Match all `.css` files
            //     use: [
            //       'style-loader', // Injects CSS into the DOM
            //       {
            //         loader: 'css-loader', // Resolves CSS imports and `@import` rules
            //         options: {
            //           importLoaders: 1, // Ensures `@import` statements are processed
            //         },
            //       },
            //     ],
            //   },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    {
                        loader: path.resolve(__dirname, "loaders/custom-style-loader.js"),
                    },
                    "css-loader",
                    "postcss-loader",
                    "sass-loader",
                ],
            },
            {
                test: /\.html$/i,
                use: ["html-loader"],
            },
        ]
    },
    plugins: [
    new CopyPlugin({
        patterns: [
            {
              from: "Test/*.html",
              to({ context, absoluteFilename }) {
                return "./[name][ext]";
              }},
              {
                from: "Test/*.css",
                to({ context, absoluteFilename }) {
                  return "./[name][ext]";
                },
                
            },
            {
                from: "TestAsK2/*.html",
                to({ context, absoluteFilename }) {
                  return "./[name][ext]";
                }},
        ]
    }),
  ],
}

module.exports = [tsConfig];