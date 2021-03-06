var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var request = require('request');

/*
 * You will need to reuse the same paths many times over in the course of this sprint.
 * Consider using the `paths` object below to store frequently used file paths. This way,
 * if you move any files, you'll only need to change your code in one place! Feel free to
 * customize it in any way you wish.
 */

exports.paths = {
  'siteAssets' : path.join(__dirname, '../web/public'),
  'archivedSites' : path.join(__dirname, '../archives/sites'),
  'list' : path.join(__dirname, '../archives/sites.txt')
};

// Used for stubbing paths for jasmine tests, do not modify
exports.initialize = function(pathsObj){
  _.each(pathsObj, function(path, type) {
    exports.paths[type] = path;
  });
};

// The following function names are provided to you to suggest how you might
// modularize your code. Keep it clean!

exports.readListOfUrls = function(cb){
  fs.readFile(exports.paths.list, function (err, data) {
    if (err) throw err;
    data = data.toString().split('\n').filter(function(url){
      return url !== "";
    });
    cb(data);
  });
};

exports.isUrlInList = function(url, cb){
  exports.readListOfUrls(function(urls) {
    cb(urls.indexOf(url) >= 0);
  });
};



exports.addUrlToList = function(url, cb){
  exports.isUrlInList(url,function(urlInList){
    if(!urlInList) {
      fs.appendFile(exports.paths.list, url + '\n', cb);
    } else {
      cb();
    }
  });
};


exports.isUrlArchived = function(url, cb){
  fs.exists(exports.paths.archivedSites + '/' + url, cb);


};

exports.downloadUrl = function(url, cb){

  request("http://" + url, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      cb(url, body);
    } else {
      console.log(error,response.statusCode,body);
    }
  });
};



