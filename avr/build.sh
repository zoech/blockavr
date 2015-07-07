#!/bin/bash

pth=$(dirname $0)
make -C $pth
make download -C $pth
