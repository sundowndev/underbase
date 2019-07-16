# Security

Although Underbase is mostly used in development, it is intended to be used in production. Security is still important to this project. Data can be lost or compromised and security flaws like [RCE](https://www.quora.com/What-is-a-RCE-Remote-code-execution-attack) or [ACE](https://en.wikipedia.org/wiki/Arbitrary_code_execution) are the most common risk.

Since this project is 100% free and open source, risks come mostly from dependencies and maintainer intentions. Underbase depends on very [few packages](https://github.com/sundowndev/underbase/blob/develop/package.json#L81) :

- [bluebird](https://www.npmjs.com/package/bluebird) ~13M weekly downloads
- [lodash](https://www.npmjs.com/package/lodash) ~25M weekly downloads
- [mongodb](https://www.npmjs.com/package/mongodb) ~1.2M weekly downloads
- [type-check](https://www.npmjs.com/package/type-check) ~7M weekly downloads

All of these packages are very popular and frenquently used by the community.

## Security check

To ensure releases are official and authentic, every tags and release commit are signed using a PGP key (linked below).

When a vulnerabilty is disclosed, GitHub automatic alerts are triggered and a audit is performed as soon as possible. A pull request is created for the fix, the version is bumped as a patch (x.x.1) then the package is deployed again on the npm registry.

## Report a vulnerabilty or security issue

Please DO NOT report security vulnerability on GitHub. Use email instead.

Send your report at raphael.at.crvx.fr [PGP PUBLIC KEY](https://crvx.fr/publickey.asc)
