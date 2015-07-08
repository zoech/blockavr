#!/bin/sh

for ff in $(ls ./lib)
do
  avr-ar rcs core.a ./lib/$ff
done

