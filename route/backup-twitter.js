var Promise = require('bluebird');
var twitter = require('twitter');
require('../Authentication');
var async = require('async');

var options = {screen_name: 'BSI_UK', count:200};
var count = 0;
var results = [];
var action = "statuses/user_timeline";

var config = new twitter({
    consumer_key: 'Kvz4iyNlnaSOGNieotK4IOUbT',
    consumer_secret: 'SvvFcL7Fvy7rLulNt3dbzbKVxHTeeHo9oovmqCpLoOVItOBaDf',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAADR4yAAAAAAAG3fH4osUYE97%2BnhRpLLCNcGeqzc%3DSDMmFgVEnFmLrRpfn1h4nEzTsijwwR6NBvbDxsFaGykCPqHfbN'
});

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

userInfo = users.map(userLookup);

function userLookup (user, done) {
    return new Promise(function(resolve, reject) {
        // users.forEach(function (user) {
        twitterUserLookup({screen_name: user}, function (user) {
            resolve(user);
        });
        // });
    });
}

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

Promise.all(userInfo).then(function (userInfo) {
    res.render('channel/twitter', {
        count: userInfo.length,
        users: userInfo
    });
});