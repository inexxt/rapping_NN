var rapgeniusClient = require("rapgenius-js");
var express = require("express");
var fs = require('fs');

var saveToFile = function(s){
    fs.appendFile("songs.txt", s, function(err) {
        if(err) {
            return console.log("saveToFile : Error :" + err);
        }

        console.log("The file was saved!");
    }); 
};

var lyricsSearchCb = function(err, lyricsAndExplanations){
    if(err){
      console.log("lyricsSearchCb : Error: " + err);
    }else{
      var lyrics = lyricsAndExplanations.lyrics;
      console.log("Found lyrics for song [title=" + lyrics.songTitle + ", main-artist=" + lyrics.mainArtist);
      
      console.log(lyrics.getFullLyrics(true));
      saveToFile(lyrics.getFullLyrics(true));
    }
};

var searchCallback = function(err, songs){
  if(err){
    console.log("searchCallback : Eror : " + err);
  }else{
    if(songs.length > 0){
      //We have some songs
      rapgeniusClient.searchLyricsAndExplanations(songs[0].link, "rap", lyricsSearchCb);
    }
  }
};

// Artist
//   - name: String
//   - link: String
//   - popularSongs: Array (of String)
//   - songs: Array (of String)
//   



var searchArtist = function(artist, id){
    rapgeniusClient.searchArtist(artist, "rap", function(err, artist){
    if(err){
        console.log("searchArtist : Error: " + err);
    }else{
        console.log(id + " / " + rappersArray.length + ": " + artist.name + " " + artist.songs.length + "\n" );
        
        for (i = 0; i < artist.songs.length; ++i) {
            console.log("\t" + i + " " + artist.songs[i].name);
            rapgeniusClient.searchSong(artist.songs[i].name, "rap", searchCallback);
        }
    }
    });
};

var rappersArray = fs.readFileSync('rappers.txt').toString().split("\n");
var i = 0;
rappersArray.forEach(function(rapper){
    searchArtist(rapper, ++i);
});
   
// rapgeniusClient.searchLyricsAndExplanations("http://genius.com/Patokalipsa-co-u-ciebie-lyrics", "rap", lyricsSearchCb);
// rapgeniusClient.searchSong("Chuj, nie bragga by Eripe, Kiju  (Ft. Dj Salty & Kiju), "rap", searchCallback);
