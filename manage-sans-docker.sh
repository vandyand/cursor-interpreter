#!/bin/bash

if [ "$1" == "start" ]; then
  nohup node server.js > output.log &
  echo "Server started"
elif [ "$1" == "stop" ]; then
  pkill -f "node server.js"
  echo "Server stopped"
elif [ "$1" == "reset" ]; then
  pkill -f "node server.js"
  echo "Server stopped"
  nohup node server.js > output.log &
  echo "Server started"
elif [ "$1" == "list" ]; then
  pgrep -fl "node server.js"
else
  echo "Invalid command. Use start, stop, reset, or list."
fi