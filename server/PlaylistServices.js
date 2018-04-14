var fs = require('fs');

function isEmpty(obj) {
  for(var prop in obj) {
      if(obj.hasOwnProperty(prop))
          return false;
  }
  return JSON.stringify(obj) === JSON.stringify({});
}

exports.getPlaylists = function(req, res) {
  var playlistFiles = fs.readdirSync(__dirname + '/ressources/playlists/');
  var playlistArray = [];
  for(var i = 0; i < playlistFiles.length; i++) {
    var playlistDir = __dirname + '/ressources/playlists/' + playlistFiles[i];
    var playlistFile = JSON.parse(fs.readFileSync(playlistDir));
    if (!isEmpty(playlistFile))
      playlistArray.push(playlistFile);
  }

  var playlistJSON = {'playlists': playlistArray};

  res.write(JSON.stringify(playlistJSON));
  res.end()
}

exports.addPlaylist = function(req, res) {
  var playlistName = req.query.name ? req.query.name : "untitled";
  var playlistBody = req.body ? (req.body['playlistBody'] ? JSON.stringify(req.body['playlistBody']) : '{}') : '{}';

  var playlistDir = __dirname + '/ressources/playlists/' + playlistName + '.json';
  var fd = fs.openSync(playlistDir, 'w');
  fs.closeSync(fd);
  fs.writeFileSync(playlistDir, playlistBody);

  res.end();
}

exports.removePlaylist = function(req, res) {
  var playlistName = req.query.name ? req.query.name : "untitled";
  var playlistDir = __dirname + '/ressources/playlists/' + playlistName + '.json';
  var fd = fs.unlinkSync(playlistDir, null);
  res.end();
}

exports.modifyPlaylist = function(req, res) {
  var playlistName = req.query.name ? req.query.name : "untitled";
  var playlistBody = req.body['playlistBody'] ? JSON.stringify(req.body['playlistBody']) : '{}';
  var playlistDir = __dirname + '/ressources/playlists/' + playlistName + '.json';
  fs.writeFileSync(playlistDir, playlistBody);

  res.end();
}
