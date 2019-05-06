#!/bin/bash

# Show debug info if requested.
[ -n "$DEBUG_STARTUP" ] && set -x

echo "////////////////////////////////////////"
echo "// ========= Runtime versions"
echo "// Node: $(node --version)"
echo "// NPM: $(npm --version)"
echo "// ========= Env variables"
echo "// ENVIRONMENT: $NODE_ENV"
echo "////////////////////////////////////////"

case $NODE_ENV in
    test)
        echo 'TEST ENVIRONMENT'
        exec npm run docker:test && npm run docker:down
        ;;

    *)
        echo 'DEVELOPMENT ENVIRONMENT'
        exec npm run docker:start && npm run docker:down
        ;;
esac

echo "BUG: UNREACHABLE!"
exit 1
