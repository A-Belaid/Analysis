var http = require("http");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var client_id = '6b966403';

exports.getArtists = function(artistName){
	var xhttp = new XMLHttpRequest();
    xhttp.open("GET", `https://api.jamendo.com/v3.0/artists/?client_id=${client_id}&format=jsonpretty&name=${artistName}`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.send(null);
    return(JSON.parse(xhttp.responseText));
}

exports.getTrackByArtist = function(artistName, trackName){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", `https://api.jamendo.com/v3.0/artists/tracks?client_id=${client_id}&format=jsonpretty&name=${artistName}&track_name=${trackName}`, false);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(null);
	return(JSON.parse(xhttp.responseText));
}

exports.getTracks = function(trackName){
	var xhttp = new XMLHttpRequest();
	xhttp.open("GET", `https://api.jamendo.com/v3.0/tracks?client_id=${client_id}&format=jsonpretty&name=${trackName}`, false);
	xhttp.setRequestHeader("Content-type", "application/json");
	xhttp.send(null);
	return(JSON.parse(xhttp.responseText));
}
