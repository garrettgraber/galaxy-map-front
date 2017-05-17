#!/bin/bash


./build.sh
# echo "Deleting "
docker rm -f galaxy-map-react-leaflet 
echo "Running galaxy-map-react-leaflet..."

docker run --name galaxy-map-react-leaflet  --link galaxy-map-server:api --link map-tile-server:tiles  -v /${PWD}/../://root/app  -p 8108:8108 galaxy-map-react-leaflet

