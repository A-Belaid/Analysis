/* Load the HTTP library */
var http = require("http");
var querystring = require('querystring');
var request = require('request');
var fs = require('fs');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var client_id = '1e62f108a5fd4ac692d4597b04ba5591'; // Your client id
var client_secret = 'f756cf635c07401fa3eb88f2483b1cfb'; // Your secret
var redirect_uri = 'http://localhost:8888/callback'; // Your redirect uri

var stateKey = 'spotify_auth_state';

var getAccessToken = function() {}
  var access_token = JSON.parse(fs.readFileSync(__dirname + '/ressources/spotifyTokens.json'))['access_token'];

  return access_token ? access_token : '';
};

exports.getArtists = function(artistName){ //todo: donner en parametre le access_token
    var xhttp = new XMLHttpRequest();

    //replace all spaces in the artist's name by a '+' sign
    artistName = artistName.replace(/\s+/g, '+');

    xhttp.open("GET", `https://api.spotify.com/v1/search?q=${artistName}&type=artist`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + getAccessToken());
    xhttp.send(null);

    //TODO: for debug purposes, TO BE REMOVED
    console.log("Spotify Reponse: ");
    console.log(xhttp.responseText)

    return(JSON.parse(xhttp.responseText));
}

exports.getTracks = function(trackName){ //todo: donner en parametre le access_token
    var xhttp = new XMLHttpRequest();

    //replace all spaces in the artist's name by a '+' sign
    trackName = trackName.replace(/\s+/g, '+');

    xhttp.open("GET", `https://api.spotify.com/v1/search?q=${trackName}&type=track`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("Authorization", "Bearer " + getAccessToken());
    xhttp.send(null);

    //TODO: for debug purposes, TO BE REMOVED
    console.log("Spotify Reponse: ");
    console.log(xhttp.responseText)

    return(JSON.parse(xhttp.responseText));
}

var generateRandomString = function(length) {
  var text = '';
  var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

exports.login = function(req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
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

exports.callback = function(req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

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

        fs.writeFile(__dirname + '/ressources/spotifyTokens.json', tokens, err => {
          if(err) return console.log(err);

          console.log(tokens);
        });

        var options = {
          url: 'https://api.spotify.com/v1/me',
          headers: { 'Authorization': 'Bearer ' + access_token },
          json: true
        };

        // use the access token to access the Spotify Web API
        request.get(options, function(error, response, body) {
          console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
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
    });
}

exports.refeshToken = function(req, res) {
  // requesting access token from refresh token
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
