#!/bin/bash

if [ "$1" == "build" ]; then
  docker build --no-cache -t micro-server .
  echo "Image built"
elif [ "$1" == "start" ]; then
  docker run -p 3000:3000 -d micro-server
  echo "Server started"
elif [ "$1" == "stop" ]; then
  docker stop $(docker ps -q --filter ancestor=micro-server)
  echo "Server stopped"
elif [ "$1" == "reset" ]; then
  docker stop $(docker ps -q --filter ancestor=micro-server)
  echo "Server stopped"
  docker run --rm -p 3000:3000 -d micro-server
  echo "Server started"
elif [ "$1" == "list" ]; then
  docker ps --filter ancestor=micro-server
elif [ "$1" == "shell" ]; then
  docker exec -it $(docker ps -q --filter ancestor=micro-server) /bin/bash
else
  echo "Invalid command. Use build, start, stop, reset, list, or shell."
fi