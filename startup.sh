#!/bin/bash
#

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
        alert 'TEST ENVIRONMENT'
        exec npm test
        ;;

    *)
        alert 'DEVELOPMENT ENVIRONMENT'
        exec npm start
        ;;
esac

echo "BUG: UNREACHABLE!"
exit 1
