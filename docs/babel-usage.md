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