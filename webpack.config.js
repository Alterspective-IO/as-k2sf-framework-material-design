const webpack = require("webpack");
const path = require("path");
const nodeExternals = require('webpack-node-externals');

const tsConfig = {
    externals: [ nodeExternals() ],
    watch: true,
    mode: 'development',
    entry: {
        main: "./src/index.ts",
        test:"./Test/index.tsx"
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
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [{
                        loader: "style-loader",
                        options: {
                            injectType: "lazyStyleTag",
                            // Do not forget that this code will be used in the browser and
                            // not all browsers support latest ECMA features like `let`, `const`, `arrow function expression` and etc,
                            // we recommend use only ECMA 5 features,
                            // but it is depends what browsers you want to support
                            insert: function insertIntoTarget(element, options) {
                                var parent = options.target || document.head;
                                var id = options.id || "as-not-set"
                                element.id = id //important for webcomponents styling 
                                parent.appendChild(element);
                            },
                        },
                    },

                    
                   "css-loader",
                   "postcss-loader",   
                    "sass-loader",

                ]
            },   
            {
                test: /\.html$/i,
                use: ["html-loader"],
            },
        ]
    }
}

module.exports = [tsConfig];