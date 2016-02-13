var config = {
  entry: [
    './client/js/main.js'
  ],
  output: {
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel',
        query: {
          presets: ['es2015']
        }
      }
    ]
  }
}

module.exports = config;
