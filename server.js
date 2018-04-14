var express = require("express");
var bodyParser = require('body-parser');
var readline = require('readline');
var cookieParser = require('cookie-parser');
var jamendoServices = require('./JamendoServices.js');
var spotifyServices = require('./SpotifyServices');
var deezerServices = require('./DeezerServices');
var playlistServices = require('./PlaylistServices');
var cors = require('cors');

var app = express();
app.use(cors());
app.use(bodyParser.json());

app.listen(8888);

app.use(express.static(__dirname + '/../public'))
   .use(cookieParser());

app.get('/artists', function(req, res){
	var artistName = req.query.name ? req.query.name : null;

	// La valeur à retourner - Format: noms d'artists séparés par des virgules
	var resStr = "";

	// -------------- JAMENDO ------------------
	var rep = jamendoServices.getArtists(artistName);
	var results = rep["results"] ? rep["results"] : null;

	if(results != null){
		for(var i = 0; i < results.length; i++){
			if(resStr == ""){
				resStr = results[i]["name"];
			} else {
				resStr += "," + results[i]["name"];
			}
		}
	}
	// ------------------------------------------

    // -------------- SPOTIFY -------------------

	//TODO: make sure that we have an access_token for spotify (call the auth process)

	var repSpotify = spotifyServices.getArtists(artistName);
    var resultsSpotify = repSpotify["results"] ? repSpotify["results"] : null;

	/*
    if(resultsSpotify != null){
        for(var i = 0; i < resultsSpotify.length; i++){
            if(resStr == ""){
                resStr = resultsSpotify[i]["name"];
            } else {
                resStr += "," + resultsSpotify[i]["name"];
            }
        }
    }
    */
	// ------------------------------------------

    // -------------- DEEZER -------------------
    var repDeezer = deezerServices.getArtists(artistName)["data"];
    if(repDeezer != null){
		for(var i = 0; i < repDeezer.length; i++){
			var artistName = repDeezer[i]["artist"]["name"];
			if(resStr.indexOf(artistName) == -1){
				if(resStr == ""){
					resStr = repDeezer[i]["artist"]["name"];
				} else {
					resStr += "," + repDeezer[i]["artist"]["name"];
				}
			}

		}
	}
    // ------------------------------------------

	// Create the JSON to return
	var resObj = { "names" : resStr.split(",") };

	res.write(JSON.stringify(resObj));
	res.end();

});

app.get('/artists/tracks', (req, res) => {
	var artistName = req.query.artistname ? req.query.artistname : "";
	var trackName = req.query.trackname ? req.query.trackname : "";

	// L'objet à retourner - Format: contient des paires {name, audio, audiodownload}
	var tracks = [];

	// ------------------------ JAMENDO ------------------------
	var rep = jamendoServices.getTrackByArtist(artistName, trackName);

	var results = rep["results"][0] ? rep["results"][0]["tracks"] : [];

	for(var i = 0; i < results.length; i++) {
		var track = {};
		track.name = results[i]["name"];
		track.link = results[i]["audio"];

		tracks.push(track);
	}
	// ---------------------------------------------------------

	// Create the JSON to return
	var resObj = { "tracks" : tracks };

  	res.write(JSON.stringify(resObj));
  	res.end();
});

app.get('/tracks', (req, res) => {
	var trackName = req.query.name ? req.query.name : "",
	isDownloadLink = req.query.isDownloadLink ? req.query.isDownloadLink : "false";

	// L'objet à retourner - Format: contient des paires {trackname, audio, audiodownload}
	var tracks = [];

	// ------------------------ JAMENDO ------------------------
	var rep = jamendoServices.getTracks(trackName);

	var results = rep["results"] ? rep["results"] : [];

	for(var i = 0; i < results.length; i++) {
		var track = {};
		track.name = results[i]["name"];
		track.artist = results[i]["artist_name"];
		track.album = results[i]["album_name"];
		track.link = results[i]["audio"];
		track.api = "Jamendo";

		tracks.push(track);
	}
	// ----------------------------------------------------------

	// ------------------------ SPOTIFY -------------------------

	var repSpotifyResponse = spotifyServices.getTracks(trackName);

	if(repSpotifyResponse != null){
        var repSpotifyTracks = repSpotifyResponse["tracks"]["items"];

        // TRACKS
		for(var i = 0; i < repSpotifyTracks.length; i++){
			if(repSpotifyTracks[i]["preview_url"] != null) {
                var track = {};
                track.name = repSpotifyTracks[i]["name"];
                track.artist = repSpotifyTracks[i]["artists"][0]["name"];
                track.link = repSpotifyTracks[i]["preview_url"];
                track.api = "Spotify";

                tracks.push(track);
            }
		}
	}

	// ----------------------------------------------------------

	// -------------- DEEZER -------------------
	var repDeezer = deezerServices.getTracks(trackName)["data"];

    if(repDeezer != null){
    	for(var i = 0; i < repDeezer.length; i++) {
			var track = {};
			track.name = repDeezer[i]["title"];
			track.artist = repDeezer[i]["artist"]["name"];
			track.album = repDeezer[i]["album"]["title"];
			track.link = repDeezer[i]["preview"];
			track.api = "Deezer";

			tracks.push(track);
		}
	}

	// ------------------------------------------

	// Create the JSON to return
	var resObj = { "tracks" : tracks };

	res.write(JSON.stringify(resObj));
	res.end();
});

//Récupération de tokens
// ------------------------ SPOTIFY -------------------------
app.get('/login', (req, res) => {
	spotifyServices.login(req, res);
});

app.get('/callback', (req, res) => {
	spotifyServices.callback(req, res);
});

app.get('/refresh_token', (req, res) => {
	spotifyServices.refeshToken(req, res);
});

//Gestion des playlists
//Retourner toutes les playlists:
app.get('/playlists', (req, res) => {
  playlistServices.getPlaylists(req, res);
})

//Creer une playlist
app.post('/playlists', (req, res) => {
  playlistServices.addPlaylist(req, res);
})

//Supprimer une playlist
app.delete('/playlists', (req, res) => {
  playlistServices.removePlaylist(req, res);
})

//Modifier une playlist
app.put('/playlists', (req, res) => {
  playlistServices.modifyPlaylist(req, res);
})
