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
    httpHelpers.serveAssets(res, path.join( archive.paths.siteAssets,'index.html'));
  } else if(req.method === 'GET' && req.url === '/loading' ) {
    httpHelpers.serveAssets(res, path.join( archive.paths.siteAssets,'loading.html'));

  } else if (req.method === 'GET') {
    archive.isUrlArchived(getName(req.url), function(exists){
      if (!exists){
        res.writeHead(404, httpHelpers.headers);
        res.end();
      } else {
        var filepath = path.join(archive.paths.archivedSites, getName(req.url), 'index.html');
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
        archive.isUrlArchived(newUrl, function(exists){
          var redirectUrl = exists ? newUrl : '/loading';
          res.writeHead(302, httpHelpers.redirectHeaders(redirectUrl)); //TODO! Redirect to loading.html
          res.end();
        });
      });
    });
  }
};
