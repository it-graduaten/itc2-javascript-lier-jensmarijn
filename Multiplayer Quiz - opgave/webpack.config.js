const path = require("path");
module.exports = {
    mode: "production",
    entry: path.resolve(__dirname, "./src/index.ts"),
    module: {
        rules: [{
            test: /.ts?$/, use: "ts-loader",
            exclude: /node_modules/,
        },],
    }, 
    resolve: {
        extensions: [".ts", ".js"],
    },
    output: {
        filename: "script.js",
        path: path.resolve(__dirname, "public", "static", "bundle"),
    },

    devtool: 'source-map',
    devServer: {
        static: {
          directory: path.join(__dirname, 'public'),
        },
        compress: false,
        port: 8080,
        devMiddleware: {
            writeToDisk: true,
          },
      },
}; 
