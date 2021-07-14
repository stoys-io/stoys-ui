const path = require('path')
const appSourceDir = path.join(__dirname, '..', 'src')

module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials'],
  typescript: {
    check: true,
    checkOptions: { async: false },
  },
  webpackFinal: async (config, { configType }) => {
    const svgRule = config.module.rules.find(rule => 'test.svg'.match(rule.test))
    svgRule.exclude = [appSourceDir]

    config.module.rules.push({
      test: /\.svg$/i,
      include: [appSourceDir],
      use: ['@svgr/webpack', 'url-loader'],
    })

    return config
  },
}
