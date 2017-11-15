module.exports = {
 entry: "./client/src/app.jsx",
 output: {
   filename: "./client/dist/bundle.js"
 },
 module: {
   loaders: [
     {
       test: /\.es6$/,
       exclude: /node_modules/,
       loader: 'babel-loader',
       query: {
         presets: ['react', 'es2015'] 
       }
     }
   ]
 },
 resolve: {
   extensions: ['.js', '.es6']
 },
}