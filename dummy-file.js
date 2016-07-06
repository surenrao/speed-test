/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

const KB = 1000;
const MB = KB * KB;

module.exports.megaByte = MB;
module.exports.kiloByte = KB;
module.exports.createDummyFile = createDummyFile;
module.exports.createDummyStream = createDummyStream;

var crypto = require('crypto');
var fs = require('fs');
var stream = require('stream');

function createDummyFile(bytes, callback){
  var filename = __dirname +  "/dummy-" + (new Date()).getTime();
  var wstream = fs.createWriteStream(filename);
  // creates random Buffer of bytes
  crypto.randomBytes(bytes, (err,buf) => {
    if (err) throw err;
    wstream.write(buf);
    wstream.end();
  });
  wstream.on('finish', () => {
    if(callback) callback(wstream.path);
  });

  if(!callback)
    return wstream.path;
}

class DummyStream extends stream.Readable {
  constructor(byteLength) {
    super();
    this.bytes = byteLength || KB;
    //console.log('total bytes ',this.bytes);
  }

  _read(size) {
      var bufSize = Math.min(size, this.bytes);
      if(bufSize <= 0){
        this.push(null);
        //console.log('when bytes is <= 0', bufSize, this.bytes, size);
      }
      else{
        var buf = crypto.randomBytes(bufSize);
        this.push(buf);
        this.bytes = this.bytes - bufSize;
        //console.log('when bytes is > 0',bufSize, this.bytes, size);
      }
  }
}

function createDummyStream(bytes){
  return new DummyStream(bytes);
}

//this will only run when directly called
if(require.main === module){
  console.log("start...");
  // console.log(createDummyFile(100 * MB,(path)=>{ console.log(path); }));
  // console.log("completed-1!");

  // var ws = fs.createWriteStream(__dirname +  "/filename-"+ (new Date()).getTime());
  // createDummyStream(100 * KB).pipe(ws);
  // ws.on('finish',function(){
  //   console.log(ws.path);
  // });
  // var rs = new DummyStream(100);
  // console.log(rs.read());
}
