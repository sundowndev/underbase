---
id: troubleshooting
title: Troubleshooting
---

## Important notice

- You cannot create your own migration at version 0. This version is reserved by migration for
  a 'vanilla' system, that is, one without any migrations applied.
- If migrating from vT1 to vTz and migration fails from a vTx to vTy, where vTx & vTy are incremental versions
  between vT1 to vTz, migration will stop at vTx.
- Prefer an async function (async | promise) for both up()/down() setup. This will ensure migration completes before version bump during execution.
- A warning will show up if up() or down() are not of type Async or Promise.

## Errors

### Not migrating, control is locked

Migrations set a lock when they are migrating, to prevent multiple instances of your clustered app from running migrations simultaneously. If your migrations throw an exception, you will need to manually remove the lock (and ensure your db is still consistent) before re-running the migration.

To remove the lock on migrations, use the [unlock](/api#unlock) method :

```javascript
async (/* ... */) => {
  await migrator.unlock();
};
```

You can also do it from the command-line :

```bash
underbase unlock
```
