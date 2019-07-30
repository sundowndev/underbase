# Security

Although Underbase is mostly used in development, it is intended to be used in production. Security is still important to this project. Data can be lost or compromised and security flaws like [RCE](https://www.quora.com/What-is-a-RCE-Remote-code-execution-attack) or [ACE](https://en.wikipedia.org/wiki/Arbitrary_code_execution) are the most common risk.

Since this project is 100% free and open source, risks come mostly from dependencies and maintainer intentions. Underbase depends on [few packages](https://github.com/sundowndev/underbase/blob/develop/package.json#L79) :

- [yargs](https://www.npmjs.com/package/yargs) ~27M weekly downloads
- [chalk](https://www.npmjs.com/package/chalk) ~25M weekly downloads
- [lodash](https://www.npmjs.com/package/lodash) ~25M weekly downloads
- [bluebird](https://www.npmjs.com/package/bluebird) ~13M weekly downloads
- [type-check](https://www.npmjs.com/package/type-check) ~7M weekly downloads
- [mongodb](https://www.npmjs.com/package/mongodb) ~1.2M weekly downloads
- [esm](https://www.npmjs.com/package/esm) ~554k weekly downloads

All of these packages are very popular and frenquently used by the community. You can see the dependency graph described below.

```
$ npm-remote-ls -n underbase -d false
└─ underbase@1.0.3
   ├─ type-check@0.3.2
   │  └─ prelude-ls@1.1.2
   ├─ lodash@4.17.11
   ├─ bluebird@3.5.3
   └─ mongodb@3.2.2
      ├─ safe-buffer@5.2.0
      └─ mongodb-core@3.2.2
         ├─ saslprep@1.0.3
         │  └─ sparse-bitfield@3.0.3
         │     └─ memory-pager@1.5.0
         ├─ require_optional@1.0.1
         │  ├─ resolve-from@2.0.0
         │  └─ semver@5.7.0
         ├─ safe-buffer@5.2.0
         └─ bson@1.1.1
```

## Security measures and audit

To ensure releases are official and authentic, every tags and release commit are signed using a PGP key (linked below).

When a vulnerabilty is disclosed, GitHub automatic alerts are triggered and a audit is performed as soon as possible. A pull request is created for the fix, the version is bumped as a patch (x.x.1) then the package is deployed again on the npm registry.

## Report a vulnerabilty or security issue

Please DO NOT report security issue on GitHub. Use email instead.

Send your report at raphael.at.crvx.fr [PGP PUBLIC KEY](https://crvx.fr/publickey.asc)
