#!/bin/bash

./build.sh

echo "Compiling..."
./compile-production.sh

docker rm -f galaxy-map-react-leaflet 

echo "Running production daemon with https"
./run-production-daemon-https.sh