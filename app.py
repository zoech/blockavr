#Copyright Jon Berg , turtlemeat.com

import string,cgi,time
import re
from os import curdir, sep
import os
from BaseHTTPServer import BaseHTTPRequestHandler, HTTPServer
import shutil
import tempfile
import subprocess

from pprint import pprint

#######################################################
"""
import lightblue as lbt
addr = ('00:13:03:28:05:47',1)
zz_sock = lbt.socket()
zz_sock.connect(addr)
"""
#######################################################

blocklydir = "%s/blockly" % curdir 
webdir = "%s/web" % curdir
rootdir = curdir
avrpath = "%s/avr/" % curdir

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
file_to_copy = ['def.h','block.c','init.c','Makefile', 'avr_action.c'];

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
                self.send_header("Location", '/index.html')
                self.end_headers()
                return
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
    
    def upload(self, code):
        """
        for file in file_to_copy:
            shutil.copyfile("%s/%s" % (avrpath, file), "%s/%s" % (dst, file))

        input = open("%s/demo.c" % (avrpath))
        output = open("%s/demo.c" % (dst), 'w')
        for s in input.xreadlines():
            output.write(s.replace('@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@', code))
        output.close()
        """
        zinput = open("%s/demo_example.c" % (avrpath))
        output = open("%s/demo.c" % (avrpath), 'w')
        for s in zinput.xreadlines():
            output.write(s.replace('@@@@@@@@@@',code))
        output.close()
        return subprocess.check_output("bash %s/build.sh 2>&1; exit 0" % avrpath, shell=True)
        #return subprocess.check_output("bash make -C %s 2>&1; bash make download -C %s 2>&1; exit 0" % (avrpath,avrpath), shell=True)


    def do_POST(self):
    
        if self.path == '/stepa':
            zz_sock.send('a')
            return
        if self.path == '/stepb':
            zz_sock.send('b')
            return
     
        if self.path == '/upload':
            ctype, pdict = cgi.parse_header(self.headers.getheader('content-type'))
            if ctype == 'application/x-www-form-urlencoded':
                length = int(self.headers.getheader('content-length'))
                postvars = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
                code = postvars['code'][0]
            self.send_response(200)
            self.end_headers()
            self.wfile.write(self.upload(code))
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
        #zz_sock.send('b')
        server = HTTPServer(('', 8000), MyHandler)
        print 'started httpserver...'
        server.serve_forever()
    except KeyboardInterrupt:
        print '^C received, shutting down server'
        #zz_sock.close()
        server.socket.close()

if __name__ == '__main__':
    main()
