const { merge } = require('webpack-merge');
const webpack = require('webpack');
const singleSpaDefaults = require('webpack-config-single-spa-react');

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'org-name',
        projectName: 'prj-name',
        webpackConfigEnv,
        argv,
    });

    return merge(defaultConfig, {
        mode: 'development',
        module: {
            rules: [
                {
                    test: /\.jsx?$/, // Transform all .js and .jsx files required somewhere with Babel
                    exclude: /node_modules/,
                    use: {
                        loader: 'babel-loader',
                    },
                },
                {
                    // Preprocess our own .css files
                    // This is the place to add your own loaders (e.g. sass/less etc.)
                    // for a list of loaders, see https://webpack.js.org/loaders/#styling
                    test: /\.css$/,
                    exclude: /node_modules/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    // Preprocess 3rd party .css files located in node_modules
                    test: /\.css$/,
                    include: /node_modules/,
                    use: ['style-loader', 'css-loader'],
                },
                {
                    test: /\.(eot|otf|ttf|woff|woff2)$/,
                    use: 'file-loader',
                },
                {
                    test: /\.svg$/,
                    use: [
                        {
                            loader: 'svg-url-loader',
                            options: {
                                // Inline files smaller than 10 kB
                                limit: 10 * 1024,
                                noquotes: true,
                            },
                        },
                    ],
                },
                {
                    test: /\.(jpg|png|gif)$/,
                    use: [
                        {
                            loader: 'url-loader',
                            options: {
                                // Inline files smaller than 10 kB
                                limit: 10 * 1024,
                            },
                        },
                        {
                            loader: 'image-webpack-loader',
                            options: {
                                mozjpeg: {
                                    enabled: false,
                                    // NOTE: mozjpeg is disabled as it causes errors in some Linux environments
                                    // Try enabling it in your environment by switching the config to:
                                    // enabled: true,
                                    // progressive: true,
                                },
                                gifsicle: {
                                    interlaced: false,
                                },
                                optipng: {
                                    optimizationLevel: 7,
                                },
                                pngquant: {
                                    quality: '65-90',
                                    speed: 4,
                                },
                            },
                        },
                    ],
                },
                {
                    test: /\.html$/,
                    use: 'html-loader',
                },
                {
                    test: /\.(mp4|webm)$/,
                    use: {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                        },
                    },
                },
            ],
        },
        plugins: [
            new webpack.HotModuleReplacementPlugin(), // Tell webpack we want hot reloading
        ],

        // Emit a source map for easier debugging
        // See https://webpack.js.org/configuration/devtool/#devtool
        devtool: 'eval-source-map',

        performance: {
            hints: false,
        },
    });
};
