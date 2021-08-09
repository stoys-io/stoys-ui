const path = require('path')

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
}
