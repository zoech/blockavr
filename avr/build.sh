#!/bin/bash

pth=$(dirname $0)
make -C $pth
make bluedown -C $pth
