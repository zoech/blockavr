#/bin/sh

port=/dev/rfcomm0

stty -F $port cs8 19200 ignbrk -brkint -imaxbel -opost -onlcr -isig -icanon -iexten -echo -echoe -echok -echoctl -echoke noflsh -ixon -crtscts
