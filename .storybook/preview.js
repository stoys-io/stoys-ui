const { addDecorator } = require('@storybook/react')
const { withPropsTable } = require('storybook-addon-react-docgen')
import 'antd/dist/antd.css'

addDecorator(withPropsTable())

export const parameters = {
  actions: { argTypesRegex: '^on[A-Z].*' },
}
