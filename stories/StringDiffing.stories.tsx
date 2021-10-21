import React from 'react'
import { Story } from '@storybook/react'

import StringDiffingComponent  from '../src/common/StringDiffing'

const Template: Story<any> = args => <StringDiffingComponent {...args} />

export const StringDiffing = Template.bind({})
StringDiffing.args = {
  current: `{
    "colors": [
      {
        "color": "black",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [255,255,255,1],
          "hex": "#000"
        }
      },
      {
        "color": "white",
        "category": "value",
        "code": {
          "rgba": [0,0,0,1],
          "hex": "#FFF"
        }
      },
      {
        "color": "red",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [255,0,0,1],
          "hex": "#FF0"
        }
      },
      {
        "color": "blue",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [0,0,255,1],
          "hex": "#00F"
        }
      },
      {
        "color": "yellow",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [255,255,0,1],
          "hex": "#FF0"
        }
      },
      {
        "color": "green",
        "category": "hue",
        "type": "secondary",
        "code": {
          "rgba": [0,255,0,1],
          "hex": "#0F0"
        }
      },
    ]
  }`,
  base: `{
    "colors": [
      {
        "color": "grey",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [128,128,128,1],
          "hex": "#808080"
        }
      },
      {
        "color": "white",
        "category": "value",
        "code": {
          "hex": "#FFF"
        }
      },
      {
        "color": "red",
        "category": "hue",
        "type": "primary",
        "test": "test",
        "code": {
          "rgba": [255,0,0,1],
          "hex": "#FF0"
        }
      },
      {
        "color": "blue",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [0,0,255,1],
          "hex": "#00F"
        }
      },
      {
        "color": "yellow",
        "category": "hue",
        "type": "primary",
        "code": {
          "rgba": [255,255,0,1],
          "hex": "#FF9"
        }
      },
      {
        "color": "green",
        "category": "hue",
        "type": "secondary",
        "code": {
          "rgba": [0,255,0,1],
          "hex": "#0F0"
        }
      },
    ]
  }`,
}
StringDiffing.storyName = 'diffing'

export default {
  title: 'Components',
  component: StringDiffing,
}
