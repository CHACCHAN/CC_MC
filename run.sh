#!/bin/bash

readonly SCREEN_NAME="cc_mc"

screen -mdS $SCREEN_NAME node ./app.js
