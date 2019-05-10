const path = require('path')

module.exports = ({ config }) => {
  config.module.rules.push({
    test: /\.less$/,
    oneOf: [
      {
        include: path.resolve('src/stories'),
        use: ['style-loader', 'css-loader', 'less-loader'],
      },
      {
        use: [
          'exports-loader?module.exports.toString()',
          'css-loader',
          'less-loader',
        ],
      },
    ],
  })

  return config
}
