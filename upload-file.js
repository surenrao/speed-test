/*jslint node: true */
/*jshint esversion: 6 */
'use strict';

module.exports.uploadFile = uploadFile;

var fs = require('fs');
function uploadFile(srcPath, destPath){
  var readable = fs.createReadStream(srcPath);
  var writable = fs.createWriteStream(destPath);
  readable.pipe(writable);
}
