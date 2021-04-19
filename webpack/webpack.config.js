const webpack = require('webpack');
const { merge } = require('webpack-merge');
const singleSpaDefaults = require('webpack-config-single-spa-react');

const WebpackPwaManifest = require('webpack-pwa-manifest');
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = (webpackConfigEnv, argv) => {
    const defaultConfig = singleSpaDefaults({
        orgName: 'org-name',
        projectName: 'prj-name',
        webpackConfigEnv,
        argv,
    });

    return merge(defaultConfig, {
        mode: 'production',
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
            new webpack.EnvironmentPlugin({
                NODE_ENV: 'production',
            }),

            new CompressionPlugin({
                algorithm: 'gzip',
                test: /\.js$|\.css$|\.html$/,
                threshold: 10240,
                minRatio: 0.8,
            }),

            new WebpackPwaManifest({
                name: 'React Boilerplate With SPA',
                short_name: 'React BP SPA',
                description: 'React Boilerplate with Single SPA integration',
            }),
        ],

        performance: {
            assetFilter: (assetFilename) =>
                !/(\.map$)|(^(main\.|favicon\.))/.test(assetFilename),
        },
    });
};
