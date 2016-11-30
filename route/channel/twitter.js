'use strict';

module.exports = twitterClient;

var Promise = require('bluebird');

var twitter = require('twitter');
require('../../Authentication');
var async = require('async');
var count = 0;
var results = [];
var globalaction = "";
var options = {};
var action = "";

var config = new twitter({
    consumer_key: 'Kvz4iyNlnaSOGNieotK4IOUbT',
    consumer_secret: 'SvvFcL7Fvy7rLulNt3dbzbKVxHTeeHo9oovmqCpLoOVItOBaDf',
    bearer_token: 'AAAAAAAAAAAAAAAAAAAAADR4yAAAAAAAG3fH4osUYE97%2BnhRpLLCNcGeqzc%3DSDMmFgVEnFmLrRpfn1h4nEzTsijwwR6NBvbDxsFaGykCPqHfbN'
});


var userInfo = [];

function twitterClient () {

    return {
        userLookup: function (user, done) {
            return new Promise(function (resolve, reject) {
                // users.forEach(function (user) {
                twitterUserLookup({screen_name: user}, function (user) {
                    resolve(user);
                });
                // });
            });
        },
        getPostTimeline: function (newaction, newoptions) {
            action = newaction;
            options = newoptions;
            results = [];
            count = 0;

            return new Promise(function (resolve, reject) {
                function twitterStatusesAsync (action, options) {
                    config.get(action, options, function (error, tweets, response) {
                        if (!error) {
                            console.log("success for: ", tweets.length + " tweets.");
                            //resolve(tweets);

                            var max_id, oldest, newest;
                            if (tweets.length > 0) {
                                // get oldest tweet
                                max_id = tweets[tweets.length - 1].id - 1;
                                //options = {};
                                options.screen_name = 'BSI_UK';
                                options.count = 200;
                                options.max_id = max_id;
                                newest = tweets[0].created_at;
                                oldest = tweets[tweets.length - 1].created_at;

                                results = results.concat(tweets);
                            }

                            count++;
                            console.log("requests ", count, max_id, oldest, newest, "\n");

                            // if theres no more tweets being returned, break recursion
                            if (tweets.length < 2) {
                                // do stuff with your tweets
                                console.log(results.length);
                                resolve(results);

                            } else {
                                twitterStatusesAsync(action, options);
                            }

                        } else {
                            console.log("Error: " + error);
                        }

                    });
                }
                twitterStatusesAsync (action, options);
               // return results;
            });





        }

        //twitterStatusesAsync(action, options).then(getMaxHistory);


    };
}

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


function getMaxHistory (data) {
    var max_id, oldest, newest;
    if (data.length > 0) {
        // get oldest tweet
        max_id = data[data.length - 1].id - 1;
        //options = {};
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
            resolve(results);

        } else {
            twitterStatusesAsync(action, options).then(getMaxHistory);
        }

}