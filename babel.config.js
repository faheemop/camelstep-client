/* eslint-disable immutable/no-mutation */
module.exports = {
  presets: [
    ['@babel/preset-env', {
      useBuiltIns: 'usage',
      corejs: 3,
    }],
    '@babel/preset-react',
  ],
  plugins: [
    '@babel/plugin-syntax-jsx',
    '@babel/plugin-transform-destructuring',
  ],
};
