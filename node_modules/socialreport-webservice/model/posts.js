'use strict';

var async = require('async');
var chalk = require('chalk');
var Promise = require('bluebird');
var socialClientHandler = require('../config/socialclient');
var socialclient = socialClientHandler();
var ObjectID = require('mongodb').ObjectID;

// User model
module.exports = function (app, callback) {

    app.db.collection('posts', function (err, collection) {

        var model = {

            getPostTimeline: function (accountid, channel, name, callback) {
                // change 'BSI_UK' to client

                switch (channel) {
                    case "twitter":
                        console.log("Getting Twitter posts for: " + name);

                        var options = {screen_name: name, user_id: name, count: 200};
                        var action = "statuses/user_timeline";

                        //var result = socialclient.getFollowers(action,accountName);
                        socialclient.getPostTimeline(channel, action, options).then(function (posts) {
                            console.log("resolved postTimeline");
                            console.log(posts.length);
                            //console.log(posts);
                            var preparedPosts = [];

                            posts.forEach(function (post) {
                                preparedPosts.push({
                                    account: new ObjectID(accountid),
                                    text: post.text,
                                    date: post.created_at
                                });
                            });

                            var results = Promise.all(preparedPosts);

                            results.then(function (data) {

                                collection.insert(data, function (err, result) {
                                    if (err) {
                                        return callback(err);
                                    }
                                    callback(null, result);
                                });
                                //callback(null, data);
                            });
                            //callback(null, posts);
                        });


                        break;
                    case "facebook":
                        console.log("Getting Facebook posts for: " + name);
                        callback(null, [{text: "No Posts"}]);
                        break;
                    case "linkedin":
                        console.log("Getting LinkedIn posts for: " + name);
                        callback(null, [{text: "No Posts"}]);
                        break;
                    default:

                }

                /*
                 var posts = [{
                 text: "Discover how having access to over 90,000 internationally recognized #standards can help your organization. >>>> http://bit.ly/2gUYJet"
                 }, {
                 text: "How does Organisational Resilience link with Lean Six Sigma? > http://bit.ly/2fQzgRC"
                 }, {
                 text: "Find out how #standards can help your organization achieve excellence. >>>> http://bit.ly/2g2gAMx"
                 }];

                 callback(null, posts);
                 */
            },

            getPosts: function (account, callback) {
                console.log("In model posts getPosts");
                var filter = {};
                filter.account = new ObjectID(account);
                //filter.account = account;

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