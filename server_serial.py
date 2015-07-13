#Copyright Jon Berg , turtlemeat.com

import string,cgi,time
import re
from os import curdir, sep
import os
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import shutil
import tempfile
import subprocess
import time

from pprint import pprint

#######################################################
"""
import bluetooth as _bt
btmac  = '00:13:03:28:04:34'
btaddr = (btmac,1)
bt_sock = _bt.BluetoothSocket()
#zz_sock.connect(addr)
"""

filename = "/dev/rfcomm0"
seri_file = open(filename,'w+')

#######################################################

NEXT_STEP     = 's'
GET_VAR       = 'v'
GET_REG       = 'r'
RESET         = 'z'

CODE_UNKNOW   = 'N/A'
HEAVY_LATENCY = 'L/T'

RESPON_END    = '\n'
PRO_END       = 'END'

rootdir = curdir
blocklydir = "%s/blockly" % rootdir 
webdir = "%s/web" % curdir
avrpath = "%s/avr/" % rootdir

mimes = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.wav': 'audio/vnd.wave',
    '.cur': 'image/vnd.microsoft.icon',
    '.png': 'image/png',
    '.ico': 'image/vnd.microsoft.icon',
    '.mp3': 'audio/mp3'
}

webpages = ['/index.html', '/blocks.js', '/c_avr_generator.js', '/zz_generator_bkf.js', '/zz_generator.js']


#file_to_copy = ['build.sh', 'pins_arduino.c', 'pins_arduino.h', 'servo.c', 'servo.h', 'servo_asm.S', 'wiring.h', 'wiring_digital.c', 'avr-thread.h', 'libavr-thread.a']
file_to_copy = ['def.h','block.cpp','arduino_init.cpp','Makefile', 'avr_action.c', 'build.sh'];

dst = tempfile.mkdtemp('', 'blockly-avr-')

sketchbookdir = os.path.expanduser('~/blockly-sketchbook')
"""
try:
    os.mkdir(sketchbookdir)
except OSError:
    pass
"""

def build_file_list():
    global sketchbookdir
    list = '';
    dirList=os.listdir(sketchbookdir)
    for fname in dirList:
        list = list + '<li><a href="#" onclick="do_action(\'%s\'); return false;">%s</a></li>\n' % (fname, fname)
    return list

def read_respon():
    recv = '';
    while len(recv) == 0:
        recv = seri_file.readline()
    #recv = seri_file.readline()
    while recv[-1] != RESPON_END:
        recv = recv + seri_file.readline()
    return recv[:-1]

def read_var(count):
    recv = '';
    while len(recv) < count*2 + 1:
        recv = recv + seri_file.read()
    return recv[:-1]

class MyHandler(BaseHTTPRequestHandler):

    def do_GET(self):
        try:
            print self.path
            print '\n' + '-'*40 +'\n'
            if self.path == '/load_form':
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                file_list = build_file_list()


                input = open("load_form")
                for s in input.xreadlines():
                    self.wfile.write(s.replace('@@@', file_list))
                input.close()
                return
            if self.path == '/save_form':
                self.send_response(200)
                self.send_header('Content-type', 'text/html')
                self.end_headers()
                file_list = build_file_list()


                input = open("save_form")
                for s in input.xreadlines():
                    self.wfile.write(s.replace('@@@', file_list))
                input.close()
                return
            if self.path == '/':
                self.send_response(301)
                self.send_header("Location", '%s/index.html' % webdir)
                self.end_headers()
                return

            filell,ext = os.path.splitext(self.path)
            mime = mimes[ext]

            f = open(rootdir + sep + self.path) #self.path has /test.html
#note that this potentially makes every file on your computer readable by the internet

            self.send_response(200)
            self.send_header('Content-type', mime)
            self.end_headers()
            self.wfile.write(f.read())
            f.close()
            return

                
        except IOError, KeyError:
            self.send_error(404,'File Not Found: %s' % self.path)
    
    def download(self, code):
        #zinput = open("%s/demo_example.c" % (avrpath))
        output = open("%s/demo.c" % (avrpath), 'w')
        output.write(code)
        output.close()
        return subprocess.check_output("bash %s/build.sh 2>&1; exit 0" % avrpath, shell=True)


    def do_POST(self):
    
        if self.path == '/stepa':
            #zz_sock.send('a')
            return
        if self.path == '/stepb':
            #zz_sock.send('b')
            return
     
        if self.path == '/download':
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'application/x-www-form-urlencoded':
                length = int(self.headers.getheader('content-length'))
                postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                code = postvars['code'][0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(self.download(code))
            return

        if self.path == '/step':
            #bt_sock.send(NEXT_STEP)
            seri_file.write(NEXT_STEP)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(read_respon())
            return

        if self.path == '/getvar':
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'application/x-www-form-urlencoded':
                length = int(self.headers.getheader('content-length'))
                postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                num = postvars['num'][0]
            cnt = int(num)
            num = chr(cnt)
            seri_file.write(GET_VAR)
            seri_file.write(num)

            respon = read_var(cnt)
            respon = [ respon[2*i:2*i+2] for i in range(0,cnt) ]
            for i in range(0,cnt):
                b1 = ord(respon[i][0]) # byte 1
                b0 = ord(respon[i][1]) # byte 0
                respon[i] = b1*256+b0
                if b1 > 127:
                    respon[i] = '-' + str(256*256 - respon[i])
                else:
                    respon[i] = str(respon[i])
            self.send_response(200)
            self.end_headers()
            self.wfile.write(','.join(respon))
            return

def main():
    try:
        #blue_init()
        seri_file = open(filename,'w+')
        server = HTTPServer(('', 8888), MyHandler)
        print 'started httpserver...'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        #bt_sock.close()
        seri_file.close()
        server.socket.close()

if __name__ == '__main__':
    main()
