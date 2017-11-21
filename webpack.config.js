const path = require('path');

module.exports = {
  entry: './client/src/app.jsx',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './client/dist'),
    publicPath: './client/dist',
  },
  module: {
    loaders: [
      {
        test: [/\.es6$/, /\.jsx?/],
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['react', 'es2015'],
        },
      },
      {
        test: /\.css$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
        ],
      },
    ],
  },
  devServer: {
    historyApiFallback: true,
    contentBase: './client/',
    inline:true,
    host: '127.0.0.1',
    port: 3000,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.es6'],
  },
};
