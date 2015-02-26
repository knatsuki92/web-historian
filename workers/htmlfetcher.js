var archive = require('../helpers/archive-helpers');
var path = require('path');
var fs = require('fs');
// eventually, you'll have some code here that uses the code in `archive-helpers.js`
// to actually download the urls you want to download.
// Get list of Urls from archive helpers

var saveData = function (url, body){
  console.log(url, body.length);
  var fsPath = path.join(archive.paths.archivedSites, url);
  fs.exists(fsPath, function(exists){
    if(!exists){
      fs.mkdir(fsPath, function(err){
        console.log(err);
        if (err) throw err;
        fs.writeFile(path.join(fsPath, 'index.html'), body);
      });
    } else {
      // fs.writeFile(path.join(fsPath, 'index.html'), body);
    }
  });
};


var fetchSites = function () {
  archive.readListOfUrls(function(urls){
    console.log(urls);
    for (var i = 0; i < urls.length; i++) {
      archive.downloadUrl(urls[i], saveData);
    }
  });
};

module.exports = fetchSites;


// for each, call downloadURls

