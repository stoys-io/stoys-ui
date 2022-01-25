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

## Publish package

If you not logged - `npm login`
1. `npm version [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease [--preid=<prerelease-id>] | from-git]`
1. `npm run prepublish`
1. `npm publish --access public`

