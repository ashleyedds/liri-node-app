require("dotenv").config();


//Set requirements
const twitter = require('twitter');
const Spotify = require('node-spotify-api');
const request = require('request');
const fs = require('fs');


var keys = require('./keys.js');

//Grab command line inputs
var liriCommand = process.argv[2];

var searchTerm = "";

//Grab everything from index[3] on as part of the search string
for (var i = 3; i < process.argv.length; i++) {
    searchTerm += process.argv[i] + " ";
};

//Twitter calls
function getTweets() {

    var client = new twitter(keys.twitter);

    var params = {
        screen_name: 'codecampbot',
        count: 20
    };

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) {
            var errMessage = "OOPS! We weren't able to grab those tweets. " + error;
            console.log(errMessage);
            return;
        } else {
            var printTweets = '--------------------\n' +
                "CodeCampBot's Tweets:\n" +
                '--------------------\n\n';

            for (var i = 0; i < tweets.length; i++) {
                printTweets += 'Created on: ' + tweets[i].created_at + '\n' +
                    'Tweet content: ' + tweets[i].text + '\n' +
                    '--------------------\n';
            }
            console.log(printTweets);
        }
    });
};

//Spotify calls
function spotifySong(searchTerm) {

    var spotify = new Spotify(keys.spotify);


    if (searchTerm === "") {
        searchTerm = "The Sign Ace of Base";
    };

    spotify.search({ type: "track", query: searchTerm }, function (error, data) {
        if (error) {
            var errMessage = "Oh darn. We couldn't spotify that song for you. Womp Womp." + error;
            console.log(errMessage);
            return;
        } else {
            var songSearched = data.tracks.items[0];

            var printSongInfo = '--------------------\n' +
                'Here is your Spotified Song:\n' +
                '--------------------\n\n' +
                'Title: ' + songSearched.name + '\n' +
                'Artist: ' + songSearched.artists[0].name + '\n' +
                'Album: ' + songSearched.album.name + '\n' +
                'Preview: ' + songSearched.preview_url + '\n';

            console.log(printSongInfo);
        }
    });
};

//OMDB calls
function getMovie(searchTerm) {

    if (searchTerm === "") {
        searchTerm = "Mr. Nobody";
    };

    searchTerm = searchTerm.split(' ').join('+');

    var queryURL = "http://omdbapi.com/?t=" + searchTerm + "&plot=full&tomatoes=true&apikey=88b9de6e";

    request(queryURL, function (error, data, body) {
        if (error) {
            var errMessage = "Dagnabit. That didn't work. Sorry Charlie." + error;
            console.log(errMessage)
            return;
        } else if (JSON.parse(body).Title === undefined){
            console.log("Hmmm...I don't see that movie. Try again.");
            return;
        } 
        else {
            printMovieInfo = '--------------------\n' +
                'Movie Information:\n' +
                '--------------------\n\n' +
                'Movie Title: ' + JSON.parse(body).Title + '\n' +
                'Year Released: ' + JSON.parse(body).Released + '\n' +
                'Rotton Tomatoes Rating: ' + JSON.parse(body).tomatoRating + '\n' +
                'IMDB Rating: ' + JSON.parse(body).imdbRating + '\n' +
                'Produced In: ' + JSON.parse(body).Country + '\n' +
                'Actors: ' + JSON.parse(body).Actors + '\n' +
                'Language: ' + JSON.parse(body).Language + '\n' +
                'Plot: ' + JSON.parse(body).Plot + '\n';

            console.log(printMovieInfo);
        }
    });
};

//Read text file and excute function
function doIt() {
    fs.readFile('./random.txt', 'utf8', function (error, data) {
        if (error) {
            var errMessage = "Sorry. This genie don't take no commands" + error;
            return;
        } else {
            var dataArr = data.split(",");
            console.log(dataArr[1]);

            spotifySong(dataArr[1]);
        }

    })
};


//Command line commands
if (liriCommand === "my-tweets") {
    getTweets();
} else if (liriCommand === "spotify-this-song") {
    spotifySong(searchTerm);
} else if (liriCommand === "movie-this") {
    getMovie(searchTerm);
} else if (liriCommand === "do-what-it-says") {
    doIt();
} else {
    console.log("Please enter one of these options:\n" +
        "my-tweets\n" +
        "spotify-this-song\n" +
        "movie-this\n" +
        "do-what-it-says");
};