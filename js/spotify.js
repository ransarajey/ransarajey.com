"use strict";
var accessToken = null;

//////

function callSpotify(type, url, json, callback) {
    
    var payload = {
        type: type,
        headers: {
            'Authorization': 'Bearer ' + accessToken,
            'Content-Type': 'application/json'
        },
        success: function(r) {
            callback(true, r);
        },
        error: function(r) {
            // 2XX status codes are good, but some have no
            // response data which triggers the error handler
            // convert it to goodness.
            if (r.status >= 200 && r.status < 300) {
                callback(true, r);
            } else {
                callback(false, r);
            }
        }
    };

    if (json != null) {
        payload.data = JSON.stringify(json);
        payload.dataType = 'json';
    }

    $.ajax(url, payload);
}

function fetchNowPlaying(callback) {
    var url = 'https://api.spotify.com/v1/me/player/currently-playing';
    callSpotify("GET", url, null, callback);
}

function fetchPlayHistory(callback) {
    var url = 'https://api.spotify.com/v1/me/player/recently-played?limit=50'
    var items = [];
    function fetcher(url) {
        callSpotify("GET", url, null, function(status, data) {
            if (status) {
                _.each(data.items, function(item) {
                    items.push(item);
                });
                if (data.next) {
                    fetcher(data.next);
                } else {
                    callback(status, items);
                }
            } else {
                callback(false, items);
            }
        });
    }

    fetcher(url);
}




function refreshNowPlaying() {
    fetchNowPlaying(function(status, data) {
        // var time_delta = now() - (data.timestamp + data.progress_ms);
        // if (data.item.album.images.length > 0) {
        //     $("#now-playing-cover-art").attr('src', data.item.album.images[0].url);
        // }
        // var progress = Math.round(data.progress_ms / 1000);
        // var sprogress = fmtTime(progress);
        // var remains = Math.round(data.item.duration_ms / 1000);
        // var sremains = fmtTime(remains);
        
        // var ctx = data.context ? data.context.type + " context" : "";
        // var uri = data.context ? data.context.uri :  " ";
        if(data.is_playing){ 
            $("#spotify-now").css("display", "");
            $("#now-playing-song-name").text(" " + data.item.name);
            $("#now-playing-artist-name").text("by " + data.item.artists[0].name);
        }

        else{
            $("#spotify-now").css("display", "none");
        }

    

       
        // $("#now-playing-album-name").text(data.item.album.name);
        // $("#now-playing-progress").text(sprogress);
        // $("#now-playing-remains").text("/ " + sremains);
        // $("#now-playing-context").text( ctx);
        // $("#now-playing-context").attr("href", uri);
        // $("#now-playing-playing").text( data.is_playing ? "playing" : "paused");

        // if (data.context) {
        //     $(".next").show();
        // } else {
        //     $(".next").hide();
        // }
        // if (data.is_playing) {
        //     $(".play").hide();
        //     $(".pause").show();
        // } else {
        //     $(".play").show();
        //     $(".pause").hide();
        // }
    });
}

function autoRefreshNowPlaying() {
    refreshNowPlaying();
    setTimeout(autoRefreshNowPlaying, 1000);
}

// function now() {
//     var d = new Date();
//     return d.getTime()
// }

// function fmtTime(time) {
//     var mins = Math.floor(time / 60);
//     time -= mins * 60;
//     var timeString = pad(mins) + ":" + pad(Math.floor(time));
//     return timeString;
// }

// function pad(num) {
//     return ("00" + num).substr(-2,2);
// }




$(document).ready(
    function() {
        


            // $("#refresh-now-playing").on("click", function() {
            //     refreshNowPlaying();
            // });

            // $("#next").on("click", function() {
            //     playNext( function() {
            //     });
            // });

            // $("#pause").on("click", function() {
            //     pause();
            // });

            // $("#play").on("click", function() {
            //     play();
            // });

            // $(".work").show();
            var res = fetch("https://accounts.spotify.com/api/token", {
            body: "grant_type=refresh_token&refresh_token=AQB7GY3_oKFMXjkUy839mDmQxdXZwOFmi1RxkNDeLDjGbzoUvOdOBoCUL6Ppl1MB0pdgrrbD1fBoinggGSdYNKVRZKefZorhlccD1YCPxjvtQoOxUNsVRsB69m0SuM5_uOk",
            headers: {
                Authorization: "Basic NzEzMmE3OWYxMTZiNDhmNWFiNTAwN2I5MmUzMWI1NmI6N2IwYzJlZWIyNThiNGY1YWEwZGM0ZGE1OWUxYjE4MGM=",
                "Content-Type": "application/x-www-form-urlencoded"
            },
            method: "POST"
            } )  
            .then(function(response) { return response.json(); })
            .then(function(json) {
         
            accessToken = json.access_token;
            

            });
            
            // accessToken = access_toooken;
            autoRefreshNowPlaying();
     
    }
);
