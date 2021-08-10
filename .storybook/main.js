module.exports = {
  core: {
    builder: 'webpack5',
  },
  stories: ['../**/*.stories.mdx', '../**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-docs', 'storybook-addon-react-docgen'],
  typescript: {
    check: true,
    checkOptions: { async: false },
  },
}
