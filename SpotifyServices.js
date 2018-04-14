var http = require("http");
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var client_id = '1e62f108a5fd4ac692d4597b04ba5591';
var client_secret = 'f756cf635c07401fa3eb88f2483b1cfb';
var redirect_uri = 'http://localhost:8888/callback';

var stateKey = 'spotify_auth_state';

var getAccessToken = function() {
  var tokensDir = __dirname + '/ressources/spotifyTokens.json';
  var tokensFile = fs.existsSync(tokensDir) ? fs.readFileSync(tokensDir) : null;
  var access_token = tokensFile ? JSON.parse(tokensFile)['access_token'] : '';

  return access_token ? access_token : '';
};

var getRefreshToken = function() {
  var tokensDir = __dirname + '/ressources/spotifyTokens.json';
  var tokensFile = fs.existsSync(tokensDir) ? fs.readFileSync(tokensDir) : null;
  var access_token = tokensFile ? JSON.parse(tokensFile)['refresh_token'] : '';

  return refresh_token ? refresh_token : '';
};

exports.getTracks = function(searchWord){
    var xhttp = new XMLHttpRequest();

    searchWord = searchWord.replace(/\s+/g, '+');

    xhttp.open("GET", `https://api.spotify.com/v1/search?q=${searchWord}&type=track`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + getAccessToken());
    xhttp.send(null);

    console.log(xhttp.responseText);

    return(JSON.parse(xhttp.responseText));
}

/*
exports.getTracks = function(trackName){
    var xhttp = new XMLHttpRequest();

    trackName = trackName.replace(/\s+/g, '+');

    xhttp.open("GET", `https://api.spotify.com/v1/search?q=${trackName}&type=track`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + getAccessToken());
    xhttp.send(null);

    return(JSON.parse(xhttp.responseText));
}
*/

//Méthodes tirées de https://github.com/spotify/web-api-auth-examples/blob/master/authorization_code/app.js
var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

//Connexion à l'API de Deezer
exports.login = function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  var scope = 'user-read-private user-read-email';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: client_id,
      scope: scope,
      redirect_uri: redirect_uri,
      state: state
    }));
}

//Redirection après login, et récupération des Tokens
exports.callback = function(req, res) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

    res.clearCookie(stateKey);
    var authOptions = {
      url: 'https://accounts.spotify.com/api/token',
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: 'authorization_code'
      },
      headers: {
        'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
      },
      json: true
    };


    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {

        var access_token = body.access_token,
            refresh_token = body.refresh_token;

        var tokens = {
          'access_token': access_token,
          'refresh_token': refresh_token
        };

        tokens = JSON.stringify(tokens);

        fs.writeFileSync(__dirname + '/ressources/spotifyTokens.json', tokens);
      }

        res.end();
    });

        /*var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        request.get(options, function(error, response, body) {
          console.log(body);
        });

        res.redirect('/#' +
          querystring.stringify({
            access_token: access_token,
            refresh_token: refresh_token
          }));
      } else {
        res.redirect('/#' +
          querystring.stringify({
            error: 'invalid_token'
          }));
      }
    });*/
}

//Générer un nouveau access_token à partir d'un refresh_token existant
exports.refeshToken = function(req, res) {
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      access_token = body.access_token;
      res.send({
        'access_token': access_token
      });
    }
  });
}
