#!/bin/bash

echo "Bootstrap is running..."
echo "Link in preinstalled packages...";
rm -rf /root/app/node_modules
ln -s /root/node_modules /root/app/node_modules
echo "npm start the app...";

# echo "Current directory: $PWD"
ls

cd /root/app
# npm ls --depth=0
# echo "Current directory: $PWD"
ls

which npm
which node
which bash

# npm ls --depth=0

chmod -R 0777 /tmp
echo "Tailing the service..."
# tail -f /root/app/app.log
# echo "Current directory: $PWD"
ls

# npm ls --depth=0;
# npm ls -g --depth=0;

echo "Current directory: $PWD"
ls
echo "Current node environment: $NODE_ENV"
echo "Run status in bootstrap: $RUN_STATUS"

if [ "$RUN_STATUS" == "compile_production" ]; then
  echo "Compiling webpack for production...'"
  npm compile:production 
fi

if [ "$RUN_STATUS" != "compile_production" ]; then
  echo "Starting express server..."
  npm start
fi
