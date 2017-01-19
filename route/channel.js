'use strict';

module.exports = route;
var Promise = require('bluebird');
var createTwitterClient = require('./channel/twitter');
// create twitter cient
var twitterClient = createTwitterClient();
var presentResultList = require('../view/presenter/result-list');
var _ = require('underscore');

function route (app) {

    var userResults = {};
    var globalClient = "";

    var getLatestResultById = function (user,index) {
        console.log("in getResultById");
        return new Promise(function(resolve, reject) {
            //model.result.getByTaskId(jobs.id, {}, function (err, results) {
            app.webservice.user(user._id).results({}, function (err, results) {
                //console.log("model.result.getByTaskId");

                if (err || !results) {
                    user.last_result = null;
                }

                if (results) {
                    console.log("results returned: " + JSON.stringify(results));
                    console.log("number results: " + results.length);

                    var length = results.length;
                    user.last_result = results[0];

                    if(length > 1) {
                        user.previous_result = results[1]; // CHANGE THIS BACK TO results[1] AFTER TESTING!!!!!!!!!!!
                        user.followersChange = user.last_result.followers_count - user.previous_result.followers_count;
                        user.friendsChange = user.last_result.friends_count - user.previous_result.friends_count;
                        user.favouritesChange = user.last_result.favourites_count - user.previous_result.favourites_count;
                        user.postsChange = user.last_result.statuses_count - user.previous_result.statuses_count;
                    }

                    // if API return accountlatest_status_date instead of latest_status_date, add latter to user object
                    // so date is displayed in UI.
                    if (user.last_result.accountlatest_status_date) {
                        user.last_result.latest_status_date = user.last_result.accountlatest_status_date;
                    }

                    console.log("last result: " + JSON.stringify(user.last_result));
                    //console.log("first result: " + JSON.stringify(results[results.length-1]));
                }

                resolve(user);
            });
        });
    };

    // Get Favourites
    app.express.get('/favourites/channel/:channel/client/:client/account/:account/id/:id', function (req, res, next) {
        var id = req.params.id;
        var channel = req.params.channel;
        var client = req.params.client;
        var account = req.params.account;

        app.webservice.accounts.favourites({account: id}, function (err, favourites) {
            console.log("favourites from webservice: ");
            console.log(favourites.length);
            console.log(JSON.stringify(favourites));
            var data = favourites[0].account.favourites;

            res.render('user/favourites', {
                count: data.length,
                favourites: data,
                isDetailsPage: true,
                channel: channel,
                client: client,
                account: account
            });
        });
    });


    // Get Post Timeline
    app.express.get('/posts/channel/:channel/client/:client/account/:account/id/:id', function (req, res, next) {
        console.log("in /posts/account/:account");
        var id = req.params.id;
        var channel = req.params.channel;
        var client = req.params.client;
        var account = req.params.account;

        console.log("account: " + account);
        console.log("id: " + id);

        app.webservice.accounts.posts({account: id}, function (err, posts) {
            console.log("posts from webservice: ");
            console.log(posts.length);
            console.log(JSON.stringify(posts));
            var data = posts[0].account.preparedPosts;

                res.render('user/posts', {
                    count: data.length,
                    posts: data,
                    isDetailsPage: true,
                    channel: channel,
                    client: client,
                    account: account
                });

        });

        //twitterClient.twitterStatusesAsync(action, options).then(twitterClient.getMaxHistory);
        /*twitterClient.getPostTimeline(action, options).then(function (posts) {
         console.log("resolved postTimeline");
         console.log(posts.length);

         res.render('user/posts', {
         count: posts.length,
         posts: posts,
         channel: channel
         });
         });*/
    });

    // Run User Lookup service
    app.express.get('/run/user/:client', function (req, res, next) {
        var client = req.params.client;

        app.webservice.users.run({client: client}, function (err, result) {
            if (err) {
                console.log(err);
                return next();
            }

            res.send("<h1>"+result+"</h1>");
        });

    });


    // Get User Lookup
    app.express.get('/channel/:channel/client/:client', function (req, res, next) {
        var channel = req.params.channel.toLowerCase();
        var client = req.params.client;
        console.log("channel: " + channel);
        console.log("client: " + client);

        var userInfo = [];
        var user = "BSI";

        // gets user accounts from users collection
        /*app.webservice.users.get({client: user, channel: channel}, function (err, user) {
         console.log("users from webservice: ");
         console.log(user.length);


         //app.webservice.user()

         res.render('user/user', {
         count: user.length,
         users: user,
         channel: channel
         });
         });*/

        app.webservice.accounts.get({client: client}, function (err, users) {
            if (err) {
                return next(err);
            }

            var preparedResults = [];
            preparedResults = users.map(getLatestResultById);
            console.log("preparedResults: " + JSON.stringify(preparedResults));
            //var followersChange = preparedResults.last_result.followers_count - preparedResults.previous_result.followers_count;
            //console.log("FollowersChange: " + followersChange);

            Promise.all(preparedResults).then(function (preparedResults) {
                console.log("Prepared Results: " + JSON.stringify(preparedResults));
                console.log("Length: " + preparedResults.length);
                // save results globally to use for graphs
                userResults = preparedResults;

                // set global client for use in other views
                globalClient = client;

                res.render('user/user', {
                    count: preparedResults.length,
                    users: preparedResults,
                    channel: channel,
                    client: client
                });
            });
        });

    });

    // Get followers
    app.express.get('/followers/channel/:channel/client/:client/account/:account/id/:id', function (req, res, next) {
        var id = req.params.id;
        var channel = req.params.channel;
        var client = req.params.client;
        var account = req.params.account;
        console.log("in followers");

        app.webservice.accounts.followers({account: id}, function (err, followers) {
            if (err) {
                return next(err);
            }
            var data = followers[0].account.followers;
            console.log("User Stats: " + JSON.stringify(data));

            res.render('user/followers', {
                count: data.length,
                followers: data,
                hasOneResult: (data.length < 2),
                //userStats: userResults,
                isDetailsPage: true,
                channel: channel,
                client: client,
                account: account
            });
        });
    });

    // Get friends
    app.express.get('/friends/channel/:channel/client/:client/account/:account/id/:id', function (req, res, next) {
        var id = req.params.id;
        var client = req.params.client;
        var account = req.params.account;
        var channel = req.params.channel;

        app.webservice.accounts.friends({account: id}, function (err, friends) {
            if (err) {
                return next(err);
            }
            //console.log("Friends: " + JSON.stringify(friends));
            var data = friends[0].account.friends;

            res.render('user/friends', {
                count: data.length,
                friends: data,
                isDetailsPage: true,
                channel: channel,
                client: client,
                account: account
            });
        });
    });


    // Get stats
    app.express.get('/stats/channel/:channel/client/:client/account/:account', function (req, res, next) {
        var acct = req.params.account;
        var client = req.params.client;
        var channel = req.params.channel;

        app.webservice.users.get({client: acct}, function (err, users) {
            console.log("Got " + users.length);
            console.log(JSON.stringify(users));
            var account = users[0].account;
            //var clientAccount = users[0].client;

            app.webservice.accounts.getone({client: users[0].client, account: users[0].account}, function (err, account) {

                console.log("account: " + account);

                var preparedResults = [];
                preparedResults = account.map(getLatestResultById);

                Promise.all(preparedResults).then(function (preparedResults) {
                    console.log("Prepared Results: " + JSON.stringify(preparedResults));
                    //console.log("Length: " + preparedResults.length);
                    // save results globally to use for graphs
                    userResults = preparedResults;

                    var presentedResults = presentResultList(users);
                    presentedResults = _.sortBy(presentedResults, function (user) {
                        return user.date;
                    });

                    res.render('user/stats', {
                        count: users.length,
                        results: presentedResults,
                        hasOneResult: (users.length < 2),
                        account: acct,
                        channel: channel,
                        //count: preparedResults.length,
                        latestResults: preparedResults,
                        isStatsPage: true,
                        isDetailsPage: false,
                        client: client
                    });
                });
            });

        });


    });
}

/*
 getBearer(function (error) {
 if (error) {
 console.log("Error getting Authentication token");
 }
 });
 */