#!/bin/bash

# Remove hidden files in public/assets
rm -f public/assets/*.* 2>/dev/null

# Remove all files in content directories
rm -f src/content/assignments/*.*
rm -f src/content/lectures/*.*
rm -f src/content/selfchecks/*.*

# Remove all files in rpd directory
rm -rf rpd/

echo "Cleanup complete"
