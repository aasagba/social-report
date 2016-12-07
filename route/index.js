'use strict';

module.exports = route;
var bodyParser = require('body-parser');

function route (app) {

    app.express.get('/', function (req, res, next) {

        res.render('index', {
            channels: [{client: "BSI", channel: "twitter"},{client: "BSI", channel: "facebook"},{client: "BSI", channel:"linkedin"}]
        });
    });
}


/*
/!**
 * Created by adrianasagba on 28/11/2016.
 *!/

var Promise = require('bluebird');
var twitter = require('twitter');
express = require('express');
var app = express();
require('./Authentication');
var async = require('async');

var config = new twitter({
    consumer_key: 'Kvz4iyNlnaSOGNieotK4IOUbT',
    consumer_secret: 'SvvFcL7Fvy7rLulNt3dbzbKVxHTeeHo9oovmqCpLoOVItOBaDf',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAADR4yAAAAAAAG3fH4osUYE97%2BnhRpLLCNcGeqzc%3DSDMmFgVEnFmLrRpfn1h4nEzTsijwwR6NBvbDxsFaGykCPqHfbN'
});

var options = {screen_name: 'BSI_UK', count:200};
var count = 0;
var results = [];
var action = "statuses/user_timeline";

function twitterUserLookup (options, done) {
    config.get('users/lookup', options, function (error, user, response) {
        if (!error) {
            //console.log(JSON.stringify(user));
            user = user[0];
            return done(user);
        } else {
            console.log("Error doing user lookup: " + error);
        }
    });
}

var users = ['BSI_UK','BSI_France','BSI_AustraliaNZ','BSI_Brazil'];
var userInfo = [];

async.map(users, userLookup, function (error, result) {
    if (!error) {
        console.log(result);

        userInfo.forEach(function (user) {
            console.log("\nUSER LOOKUP: \n");
            console.log("Name: " + user.name);
            console.log("Location: " + user.location);
            console.log("Followers: " + user.followers);
            console.log("Friends: " + user.friends);
            console.log("Favourites: " + user.favourites);
            console.log("Posts: " + user.posts);
            console.log("Latest Post " + user.latest_post_date + ": \n" + user.latest_post);
        });
    }
});


function userLookup (user, done) {

    // users.forEach(function (user) {
    twitterUserLookup({screen_name: user}, function (user) {
        //console.log(user.name);
        userInfo.push({
            "name": user.name,
            "location": user.location,
            "followers": user.followers_count,
            "friends": user.friends_count,
            "favourites": user.favourites_count,
            "posts": user.statuses_count,
            "latest_post": user.status.text,
            "latest_post_date": user.status.created_at
        });

        done(null, "pushed " + user.name);
    });
    // });
}


/!*
 userInfo.forEach(function (user) {
 console.log(JSON.stringify(user));
 });*!/



function twitterStatusesAsync (action, options) {
    return new Promise(function (resolve, reject) {
        config.get(action, options, function (error, tweets, response) {
            if (!error) {
                console.log("success for: ", tweets.length + " tweets.");
                resolve(tweets);
            } else {
                console.log("Error: " + error);
            }

        });
    });

}

//twitterStatusesAsync(action, options).then(getMaxHistory);

/!*config.get('statuses/user_timeline', options, function (error, tweets, response) {


 });*!/

function getMaxHistory(data) {
    var max_id, options, oldest, newest;
    if (data.length > 0) {
        // get oldest tweet
        max_id = data[data.length - 1].id - 1;
        options = {};
        options.screen_name = 'BSI_UK';
        options.count = 200;
        options.max_id = max_id;
        newest = data[0].created_at;
        oldest = data[data.length - 1].created_at;

        results = results.concat(data);
    }

    count++;
    console.log("requests ", count, max_id, oldest, newest, "\n");

    // if theres no more tweets being returned, break recursion
    if (data.length < 2) {
        // do stuff with your tweets
        console.log(results.length);

    } else {
        twitterStatusesAsync(action, options).then( getMaxHistory );
    }
}
/!*if (!error) {
 console.log(tweets);
 console.log("count: " + tweets.length);


 } else {
 console.log("Error: " + JSON.stringify(error));
 }*!/


/!*
 getBearer(function (error) {
 if (error) {
 console.log("Error getting Authentication token");
 }
 });
 *!/

/!* Error Handling *!/

process.on( 'SIGINT', function() {
    console.log( '\nGracefully shutting down from SIGINT (Ctrl-C)' );
    process.exit( );
});

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
    process.exit(1);
});

app.listen(process.env.PORT || 6000);
console.log("Social Report running on port 6000");
exports = module.exports = app;*/
