---
id: typescript-usage
title: Typescript usage
---

Underbase support third-party compilers to run migrations such as Babel, Typescript and ESM.

See [this code example](https://github.com/sundowndev/underbase/tree/develop/examples/babel-typescript).

## Instructions

First, ensure you have the following packages installed :

- `typescript`
- `ts-node`
- `@underbase/cli`
- `@underbase/types`

No need to use tsconfig.json! You can then use Typescript to transpile migration files on the fly : 

```
underbase --require ts-node/register --config underbase.config.js
```