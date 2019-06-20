---
id: installation
title: Installation
---

## CLI usage

### Installation

First, install the cli app using npm or yarn.

It is recommended to install `underbase` globally :

```bash
npm i underbase -g
# or...
yarn global add underbase
```

You can also install the package locally

```bash
npm i underbase --save-dev
yarn add underbase --dev
```

### Verify installation

```bash
underbase --help
# or...
./node_modules/underbase/dist/src/cli.js --help
```

It should output this message :

```bash
Usage: underbase <command> [OPTIONS]

[...]
```

## Module usage

### Installation

Install the Underbase library :

```bash
npm i underbase --save-dev
```

See [module usage](module-usage) to learn how to use the module.