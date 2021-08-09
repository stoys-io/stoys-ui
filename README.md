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
%%html
    <div id="app">default</div>

    <script type="module">

        import 'https://unpkg.com/@stoys/stoys@0.2.1/lib/stoys-ui.js'

        var domNode = document.getElementById("app");

        const { Profiler, ReactDOM, React } = stoysUi

        ReactDOM.render(
            React.createElement(Profiler, {datasets: [...]}, null),
            element
        );

    </script>
```
