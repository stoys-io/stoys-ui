# Stoys UI

## Installation

```
npm install git@github.com:stoys-io/stoys-ui.git
```

## Usage

Running documentation locally

1. `git clone git@github.com:stoys-io/stoys-ui.git`
1. `cd stoys-ui`
1. `npm i`
1. `npm run storybook`

## Bundling package

build packages: `npm run bundle-build`

Copy compiled `stoys-ui.js` from `dist` folder to your project.

#### Example of using library in Jupyter project

```
from IPython.core.display import HTML
```

```
with open ({path-to-bundle.js}, "r") as bundle:
    bundleString = bundle.read()
```

```
HTML("""

<div id="app"></div>

<script>

%s

(function() {

  const {Profiler, Metrics, Quality, React, ReactDOM} = dqLibrary

  const sampleData = %s

  ReactDOM.render(
    React.createElement({Profiler || Metrics || Quality}, {data: sampleData}, null),
    document.getElementById('app')
  );

})()

</script>

""" % (bundleString, {your-data}))
```
