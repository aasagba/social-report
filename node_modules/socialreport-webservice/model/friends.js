'use strict';

var async = require('async');
var chalk = require('chalk');
var Promise = require('bluebird');
var socialClientHandler = require('../config/socialclient.js');
var socialclient = socialClientHandler();
var ObjectID = require('mongodb').ObjectID;

module.exports = function (app, callback) {
    app.db.collection('friends', function (err, collection) {

        var model = {

            processFriends: function (account, accountName, callback) {
                var action = 'friends/ids';
                var result = socialclient.getFollowers(action,accountName);

                Promise.all(result).then(function (result) {
                    var processResults = [];
                    // save fields that we want and put in db.
                    result.forEach( function (follower) {
                        processResults.push({
                            account: account,
                            name: follower.name, // foreign key for users collection
                            screen_name: follower.screen_name, // eg. BSI
                            location: follower.location,
                            description: follower.description,
                            //url: follower.display_url
                        });
                    });
                    var results = Promise.all(processResults);

                    results.then(function (data) {
                        collection.insert(data, function (err, result) {
                            if (err) {
                                return callback(err);
                            }
                            callback(null, result);
                        });

                        //callback(null, data);
                    });


                });

            },

            getFriends: function (account, callback) {
                console.log("In model friends getFriends");
                var filter = {};
                filter.account = new ObjectID(account);

                collection
                    .find(filter)
                    // .sort({followers_count: -1})
                    .toArray(function (err, results) {
                        if (err) {
                            return callback(err);
                        }
                        console.log("Results: " + results);
                        callback(null, results);
                    });
            }
        };
        callback(null, model);


    });
}