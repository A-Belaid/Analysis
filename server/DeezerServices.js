var http = require("http");
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

var client_id = 't35HXu0Ah7mshpCLkst5qHvxeXprp1SpS14jsnN8C3tOrhyb5J';

exports.getArtists = function(artistName){

    var xhttp = new XMLHttpRequest();

    artistName = artistName.replace(/\s+/g, '+');

    xhttp.open("GET", `https://deezerdevs-deezer.p.mashape.com/search?q=${artistName}`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("X-Mashape-Key", client_id);
    xhttp.send(null);

    return(JSON.parse(xhttp.responseText));
}

exports.getTracks = function(trackName){

    var xhttp = new XMLHttpRequest();

    trackName = trackName.replace(/\s+/g, '+');

    xhttp.open("GET", `https://deezerdevs-deezer.p.mashape.com/search?q=${trackName}`, false);
    xhttp.setRequestHeader("Content-type", "application/json");
    xhttp.setRequestHeader("X-Mashape-Key", client_id);
    xhttp.send(null);

    return(JSON.parse(xhttp.responseText));
}
