---
id: babel-usage
title: Babel usage
---

Underbase support third-party compilers to run migrations such as Babel, Typescript and ESM.

See [this code example](https://github.com/sundowndev/underbase/tree/develop/examples/babel-async-await).

## Instructions

First, ensure you have the following packages installed :

- `@babel/core`
- `@babel/register`
- `@babel/preset-env`
- `@underbase/cli`

Configure your `babel.config.js` as the following : 

```
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: {
          node: 'current',
        },
      },
    ],
  ],
};
```

You can then use Babel to transpile migration files on the fly : 

```
underbase --require @babel/register --config underbase.config.js
```

### Babel + Typescript

To use Babel with Typescript, you have to enable `.ts` extension. In order do that, we've created a package which uses `@babel/register`.

You still need to have `@babel/register` and `@babel/preset-typescript` installed.

See [this code example](https://github.com/sundowndev/underbase/tree/develop/examples/babel-typescript).

#### Instructions

1. Install the package

```bash
yarn add -D @underbase/babel-register-ts
```

2. Then, you can use your Typescript files

```bash
underbase -r @underbase/babel-register-ts migrate 1.0
```