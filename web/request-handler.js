var path = require('path');
var url = require('url');
var fs = require('fs');
var archive = require('../helpers/archive-helpers');
var httpHelpers = require('./http-helpers');
// require more modules/folders here!
var getName = function(site) {
  return url.parse(site).pathname;
}

exports.handleRequest = function (req, res) {

  if (req.method === 'GET' && req.url === '/') {

    res.writeHead(200, httpHelpers.headers);
    res.end('<input>'); //will need to send index.html eventually!

  } else if (req.method === 'GET') {
    archive.isUrlArchived(getName(req.url), function(exists){
      if (!exists){
        res.writeHead(404, httpHelpers.headers);
        res.end();
      } else {
        var filepath = path.join(archive.paths.archivedSites, getName(req.url));
        fs.readFile(filepath, function (error, data) {
            if (error) throw error;
            res.writeHead(200, httpHelpers.headers);
            res.end(data);
          });
      }
    });


  } else if (req.method === 'POST') {

    var data = req.url + '?'; //start w/url so we can use url.parse later
    req.on("data", function(chunk){
      data += chunk;
    });

    req.on("end", function(){
      var newUrl = url.parse(data, true).query.url;
      archive.addUrlToList(newUrl, function(err){
        if (err) throw err;
        res.writeHead(302, httpHelpers.headers);
        res.end();
      });
    });
  }
};
