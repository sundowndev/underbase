# Security

Although Underbase is mostly used in development, it is intended to be used in production. Security is still important to this project. Personal and production data being lost or compromised are the most common risk.

To ensure releases are official and authentic, every tags and release commit are signed using a PGP key (linked below). When a vulnerabilty is disclosed, GitHub automatic alerts are triggered and a audit is performed as soon as possible. A pull request is created for the fix, the version is bumped as a patch (x.x.1) then the package is deployed again on the npm registry.

Since this project is 100% free and open source, risks come mostly from dependencies and maintainer intentions. Underbase depends on [the following packages](https://github.com/sundowndev/underbase/blob/develop/package.json#L79) :

- [yargs](https://www.npmjs.com/package/yargs) ~27M weekly downloads
- [chalk](https://www.npmjs.com/package/chalk) ~25M weekly downloads
- [lodash](https://www.npmjs.com/package/lodash) ~25M weekly downloads
- [bluebird](https://www.npmjs.com/package/bluebird) ~13M weekly downloads
- [type-check](https://www.npmjs.com/package/type-check) ~7M weekly downloads
- [mongodb](https://www.npmjs.com/package/mongodb) ~1.2M weekly downloads

All of these packages are very popular and frenquently used by the community. You can see the full dependency graph described below.

```
$ npm-remote-ls -n @underbase/cli -d false

└─ @underbase/cli@2.0.1-alpha.0
   ├─ fs-extra@8.1.0
   │  ├─ jsonfile@4.0.0
   │  │  └─ graceful-fs@4.2.2
   │  ├─ universalify@0.1.2
   │  └─ graceful-fs@4.2.2
   ├─ yargs@13.3.0
   │  ├─ get-caller-file@2.0.5
   │  ├─ require-directory@2.1.1
   │  ├─ find-up@3.0.0
   │  │  └─ locate-path@3.0.0
   │  │     ├─ p-locate@3.0.0
   │  │     │  └─ p-limit@2.2.1
   │  │     │     └─ p-try@2.2.0
   │  │     └─ path-exists@3.0.0
   │  ├─ cliui@5.0.0
   │  │  ├─ string-width@3.1.0
   │  │  ├─ strip-ansi@5.2.0
   │  │  └─ wrap-ansi@5.1.0
   │  │     ├─ string-width@3.1.0
   │  │     ├─ strip-ansi@5.2.0
   │  │     └─ ansi-styles@3.2.1
   │  ├─ set-blocking@2.0.0
   │  ├─ which-module@2.0.0
   │  ├─ string-width@3.1.0
   │  │  ├─ is-fullwidth-code-point@2.0.0
   │  │  ├─ strip-ansi@5.2.0
   │  │  │  └─ ansi-regex@4.1.0
   │  │  └─ emoji-regex@7.0.3
   │  ├─ require-main-filename@2.0.0
   │  ├─ y18n@4.0.0
   │  └─ yargs-parser@13.1.1
   │     ├─ camelcase@5.3.1
   │     └─ decamelize@1.2.0
   │
   ├─ @underbase/types@2.0.0-alpha.0
   │  ├─ @underbase/query-interface@2.0.0-alpha.0
   │  │  └─ mongodb@3.3.0-beta2
   │  │     ├─ require_optional@1.0.1
   │  │     ├─ bson@1.1.1
   │  │     └─ safe-buffer@5.2.0
   │  └─ mongodb@3.3.0
   │     ├─ require_optional@1.0.1
   │     │  ├─ semver@5.7.1
   │     │  └─ resolve-from@2.0.0
   │     ├─ bson@1.1.1
   │     └─ safe-buffer@5.2.0
   │
   ├─ @underbase/core@2.0.0-alpha.0
   │  ├─ @underbase/types@2.0.0-alpha.0
   │  ├─ bluebird@3.5.5
   │  ├─ chalk@2.4.2
   │  │  ├─ ansi-styles@3.2.1
   │  │  │  └─ color-convert@1.9.3
   │  │  │     └─ color-name@1.1.3
   │  │  ├─ escape-string-regexp@1.0.5
   │  │  └─ supports-color@5.5.0
   │  │     └─ has-flag@3.0.0
   │  ├─ @underbase/query-interface@2.0.0-alpha.0
   │  ├─ lodash@4.17.15
   │  ├─ type-check@0.3.2
   │  │  └─ prelude-ls@1.1.2
   │  ├─ mongodb@3.2.2
   │  │  ├─ mongodb-core@3.2.2
   │  │  │  ├─ saslprep@1.0.3
   │  │  │  │  └─ sparse-bitfield@3.0.3
   │  │  │  │     └─ memory-pager@1.5.0
   │  │  │  ├─ require_optional@1.0.1
   │  │  │  ├─ safe-buffer@5.2.0
   │  │  │  └─ bson@1.1.1
   │  │  └─ safe-buffer@5.2.0
   │  └─ @underbase/utils@2.0.0-alpha.0
   │
   └─ @underbase/utils@2.0.0-alpha.0
      ├─ @underbase/types@2.0.0-alpha.0
      └─ chalk@2.4.2
```

## Report a security issue

Please DO NOT report security issue on GitHub. Use email instead.

Send your report at `raphael.at.crvx.fr` [PGP PUBLIC KEY](https://crvx.fr/publickey.asc)
