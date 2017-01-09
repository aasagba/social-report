'use strict';

module.exports = twitterClient;

var Promise = require('bluebird');

var twitter = require('twitter');
require('../Authentication');
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
        // RETURN TEST FOLLOWERS
        // var followers = require('../data/followers.json');
        // resolve(followers);

        getFollowers: function (action, user, done) {
            var results = [];

            return new Promise(function (resolve, reject) {

                var options = {
                    screen_name: user
                };

                config.get(action, options, function getData(error, userids, response) {
                    if (!error) {
                        results = userids.ids;
                        console.log(JSON.stringify(results));

                        // Todo Loop ids and do user lookup and populate followers array
                        var users = [];

                        users = followerLookup(results);

                        var processUsers = Promise.all(users);

                        Promise.all(processUsers).then(function (data) {
                            resolve(data);
                        });

                    } else {
                        console.log("Error doing followers lookup: " + error);
                    }
                });
            });
        },

        userLookup: function (user, done) {
            return new Promise(function (resolve, reject) {
                // users.forEach(function (user) {
                twitterUserLookup({screen_name: user.accountid}, user._id, user.client, user.channel, function (user) {
                    resolve(user);
                });
                // });
            });
        },
        getPostTimeline: function (channel, newaction, newoptions) {
            action = newaction;
            options = newoptions;
            results = [];
            count = 0;

            console.log("Options in getPostTimeline: " + JSON.stringify(options));

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
                                //options.screen_name = 'BSI_UK';
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

function twitterUserLookup (options, id, client, channel, done) {
    config.get('users/lookup', options, function (error, user, response) {
        if (!error) {

            user[0].userid = id;
            user[0].clientid = client;
            user[0].channel = channel;
            user = user[0];
            //console.log("users/lookup" + JSON.stringify(user));
            return done(user);
        } else {
            console.log("Error doing user lookup: " + JSON.stringify(error) + " id: " + id);
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

function userLook (results, done) {
    console.log("In userLook");
    console.log("Results length: " + results.length);
    var users = [];

    return new Promise(function (resolve, reject) {

        var i, j, temporary, chunk = 99;

        for (i = 0; i < results.lenth; i += chunk) {
            temporary = results.slice(i, i + chunk).toString();
            console.log("Temporary: " + temporary);

            config.get('users/lookup', {user_id: temporary}, function (error, user, response) {
                if (!error) {
                    users.push(user);
                    console.log(user.name);
                    console.log("response" + response);
                    //return done(user);
                } else {
                    console.log("Error doing user lookup: " + JSON.stringify(error) + " id: " + id);
                }
            });
        }
        resolve(users);
    });
    done(null,users);
}


function followerLookup (results) {
    console.log("In userLookupTest");
    console.log("Results length: " + results.length);

    var i = 0, j, temporary, chunk = 99, users = [];
    var action = 'users/lookup';
    temporary = results.slice(i, i + chunk).toString();
    var options = {user_id: temporary};

    return new Promise(function (resolve, reject) {
        function TwitterLookupAsync(action, options) {

            config.get('users/lookup', options, function (error, user, response) {
                //if (!error) {
                    users = users.concat(user);
                    //console.log(user);
                    //console.log("response" + JSON.stringify(response));

                    // if more ids
                    if (i < results.length) {
                        i += chunk;
                        temporary = results.slice(i, i + chunk).toString();
                        TwitterLookupAsync(action, {user_id: temporary});
                    } else {
                        resolve(users)
                    }
                    //return done(user);
                /*} else {
                    console.log("Error doing user lookup: " + JSON.stringify(error));
                }*/
            });
        }
        TwitterLookupAsync(action, options);
    });
}