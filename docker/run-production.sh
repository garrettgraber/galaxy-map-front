#!/bin/bash


./build.sh
# echo "Deleting "
docker rm -f galaxy-map-react-leaflet 
echo "Running galaxy-map-react-leaflet..."

docker run --name galaxy-map-react-leaflet   --env NODE_ENV=production  -v /${PWD}/../://root/app  -p 80:8108 galaxy-map-react-leaflet
