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

import bluetooth as _bt
btmac  = '00:13:03:28:04:34'
btaddr = (btmac,1)
bt_sock = _bt.BluetoothSocket()
#zz_sock.connect(addr)

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
try:
    os.mkdir(sketchbookdir)
except OSError:
    pass

def build_file_list():
    global sketchbookdir
    list = '';
    dirList=os.listdir(sketchbookdir)
    for fname in dirList:
        list = list + '<li><a href="#" onclick="do_action(\'%s\'); return false;">%s</a></li>\n' % (fname, fname)
    return list

def blue_init():
    if not btmac in _bt.discover_devices():
        print "mac address \"%s\" could not be discovered" % btmac
        #exit()
    try:
        bt_sock.connect(btaddr)
        bt_sock.settimeout(10)
    except bluetooth.btcommon.BluetoothErorr:
        print "bluetooth error"

def read_respon():
    try:
        recv = bt_sock.recv(10);
        while recv[-1] != RESPON_END:
            recv += bt_sock.recv(10);
        return recv[:-1]
    except bluetooth.btcommon.BluetoothErorr:
        print "read down machine response erorr"
        return 'down machine respon error'

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
            """
            if self.path in webpages:
                filell,ext = os.path.splitext(self.path)
                mime = mimes[ext]
                f = open(webdir + sep + self.path)
                self.send_response(200)
                self.send_header('Content-type',mime)
                self.end_headers()
                self.wfile.write(f.read())
                f.close()
                return
            """

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
        """
        for s in zinput.xreadlines():
            output.write(s.replace('@@@@@@@@@@',code))
        """
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
            bt_sock.send(NEXT_STEP)
            self.send_response(200)
            self.end_headers()
            self.wfile.write(read_respon())
            return

        if self.path == '/conn_blue':
            blue_init();
            return
    """
        if self.path == '/save':
            self.send_response(200)
            self.end_headers()
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'application/x-www-form-urlencoded':
                length = int(self.headers.getheader('content-length'))
                postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                name = postvars['name'][0]
                is_new = postvars['isNew'][0]
                code = postvars['code'][0]

                output = open("%s/%s" % (sketchbookdir, name), 'w')
                output.write(code)
                output.close()
                self.wfile.write("File %s is saved" % name)
        if self.path == '/load':
            self.send_response(200)
            self.end_headers()
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'application/x-www-form-urlencoded':
                length = int(self.headers.getheader('content-length'))
                postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                name = postvars['name'][0]
                input = open("%s/%s" % (sketchbookdir, name))
                self.wfile.write(input.read())
                input.close()
    """
def main():
    try:
        #blue_init()
        server = HTTPServer(('', 8888), MyHandler)
        print 'started httpserver...'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        bt_sock.close()
        server.socket.close()

if __name__ == '__main__':
    main()
