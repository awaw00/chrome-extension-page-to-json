import path from 'path';
import cssnano from 'cssnano';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import CopyWebpackPlugin from 'copy-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const __DEV__ = process.env.NODE_ENV === 'development';

let devtool = 'source-map';

const root = (_path = '.') => path.join(__dirname, _path);

const entry = {
  app: [root('./src/index.js')]
};

const resolve = {
  extensions: ['', '.js', '.jsx'],
  root: root('./src'),
  // alias: {
  //   'react': 'inferno-compat',
  //   'react-dom': 'inferno-compat',
  //   'react-redux': 'inferno-redux'
  // }
};

const output = {
  path: root('./dist'),
  filename: '[name].js?v=[hash:6]',
  publicPath: './'
};

const baseCssLoader =
  'css-loader?-sourceMap&-minimize&' +
  'modules&importLoaders=1&localIdentName=[name]_[local]_[hash:base64:5]';

let loaders = [
  {
    test: /\.jsx?$/,
    loader: 'babel-loader',
    exclude: /node_modules/
  },
  { test: /\.woff(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff' },
  { test: /\.woff2(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/font-woff2' },
  { test: /\.otf(\?.*)?$/, loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=font/opentype' },
  { test: /\.ttf(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=application/octet-stream' },
  { test: /\.eot(\?.*)?$/, loader: 'file-loader?prefix=fonts/&name=[path][name].[ext]' },
  { test: /\.svg(\?.*)?$/, loader: 'url-loader?prefix=fonts/&name=[path][name].[ext]&limit=10000&mimetype=image/svg+xml' },
  { test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192' }
];

const cssLoaders = [
  {
    test: /\.css$/,
    loader: 'style-loader!css-loader?-sourceMap-minimize!postcss-loader',
    include: /node_modules/
  },
  {
    test: /\.less$/,
    loader: 'style-loader!css-loader?-sourceMap-minimize!less-loader!postcss-loader',
    include: /node_modules/
  },
  {
    test: /\.css$/,
    loader: 'style-loader!' + baseCssLoader + '!postcss-loader',
    exclude: /node_modules/
  },
  {
    test: /\.less$/,
    loader: 'style-loader!' + baseCssLoader + '!less-loader!postcss-loader',
    exclude: /node_modules/
  }
];

const postcss = [
  cssnano({
    autoprefixer: {
      add: true,
      remove: true,
      browsers: ['last 2 versions']
    },
    discardComments: {
      removeAll: true
    },
    discardUnused: false,
    mergeIdents: false,
    reduceIdents: false,
    safe: true,
    sourcemap: false
  })
];

const plugins = [
  new webpack.DefinePlugin({
    __DEV__,
    'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV)
  }),
  new HtmlWebpackPlugin({
    template: root('./src/index.ejs'),
    filename: root('./dist/index.html'),
    title: 'Preact Starter',
    inject: 'body'
  }),
  new CopyWebpackPlugin([
    {from: root('./static')}
  ])
];

if (__DEV__) {
  output.publicPath = '/';

  loaders = loaders.concat(cssLoaders);

  plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  );
} else {
  devtool = '';

  const styleLoader = 'style-loader';
  loaders = loaders.concat(cssLoaders.map((i) => {
    i.loader = ExtractTextPlugin.extract(styleLoader, i.loader.substring(styleLoader.length + 1));
    return i;
  }));

  plugins.push(
    new webpack.optimize.OccurrenceOrderPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      compress: {
        unused: true,
        dead_code: true,
        warnings: false
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['vendor']
    }),
    new ExtractTextPlugin('[name].css?v=[contenthash:6]', {
      allChunks: true
    })
  );
}

export default {
  devtool,
  entry,
  resolve,
  output,
  module: {
    loaders
  },
  plugins,
  postcss
};
