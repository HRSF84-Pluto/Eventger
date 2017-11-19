module.exports = {
  entry: './client/src/app.jsx',
  output: {
    filename: './client/dist/bundle.js',
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
    ],
  },
  resolve: {
    extensions: ['.jsx', '.js', '.es6'],
  },
};
