const path = require('path');
const nodeExternals = require('webpack-node-externals');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
    target: 'node',
    entry: './src/main.ts',
    plugins: [
        new ESLintPlugin({
            extensions: ['js', 'ts'],
            exclude: ['node_modules', 'dist'],
            cache: true,
            fix: true,
            emitWarning: true,
        }),
    ],
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                loader: "ts-loader",
                options: {},
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            src: path.resolve(__dirname, "src"),
        }
    },
    output: {
        filename: '[name].bundle.js',
        path: path.resolve(__dirname, 'dist'),
        clean: true,
    },
    externals: [
        nodeExternals()
    ],
    optimization: {
        moduleIds: "deterministic",
        splitChunks: {
            chunks: "all",
        }
    }
};