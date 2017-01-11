'use strict';

module.exports = route;
var Promise = require('bluebird');
var createTwitterClient = require('./channel/twitter');
// create twitter cient
var twitterClient = createTwitterClient();

function route (app) {

    var userResults = {};

    var getLatestResultById = function (user,index) {
        console.log("in getResultById");
        return new Promise(function(resolve, reject) {
            //model.result.getByTaskId(task.id, {}, function (err, results) {
            app.webservice.user(user._id).results({}, function (err, results) {
                //console.log("model.result.getByTaskId");

                if (err || !results) {
                    user.last_result = null;
                }

                if (results) {
                    console.log("results returned: " + JSON.stringify(results));
                    console.log("number results: " + results.length);
                    user.last_result = results[0];
                    user.previous_result = results[1]; // CHANGE THIS BACK TO results[1] AFTER TESTING!!!!!!!!!!!
                    user.followersChange = user.last_result.followers_count - user.previous_result.followers_count;
                    user.friendsChange = user.last_result.friends_count - user.previous_result.friends_count;
                    user.postsChange = user.last_result.statuses_count - user.previous_result.statuses_count;

                    console.log("last result: " + JSON.stringify(user.last_result));
                    //console.log("first result: " + JSON.stringify(results[results.length-1]));
                }

                resolve(user);
            });
        });
    };


    // Get Post Timeline
    app.express.get('/posts/account/:account/id/:id', function (req, res, next) {
        console.log("in /posts/account/:account");
        var id = req.params.id;
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
                    channel: "twitter",
                    account: account,
                    isDetailsPage: true,
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

                res.render('user/user', {
                    count: preparedResults.length,
                    users: preparedResults,
                    channel: channel,
                    client: client
                });
            });
        });

        // NEED TO WRITE CODE TO GET USER LOOKUP VIA /USER/RESULTS
        /**********
         app.webservice.users.get({client: client}, function (err, users) {
            console.log("Got " + users.length + " Users from Webservice for the " + channel + " channel.");

            console.log(JSON.stringify(users));

            res.render('user/user', {
                count: users.length,
                users: users,
                channel: channel,
                client: client
            });
        });
         ***********/
        // MAYBE REPLACE LOGIC ABOVE AS DONT NEED TO GET LIST OF USERS

        /*
         switch (channel) {
         case "twitter":
         // get users, hardcode for now
         var users = ['BSI_UK', 'BSI_France', 'BSI_AustraliaNZ', 'BSI_Brazil'];

         // perform user lookup
         userInfo = users.map(twitterClient.userLookup);

         break;
         case "facebook":

         break;
         case "linkedin":

         break;
         default:

         }


         Promise.all(userInfo).then(function (userInfo) {
         res.render('user/user', {
         count: userInfo.length,
         users: userInfo,
         channel: channel
         });
         });*/
    });

    // Get followers
    app.express.get('/followers/channel/:channel/account/:account/id/:id', function (req, res, next) {
        var id = req.params.id;
        var channel = req.params.channel;
        var account = req.params.account;
        console.log("in followers");

        app.webservice.accounts.followers({account: id}, function (err, followers) {
            if (err) {
                return next(err);
            }
            var data = followers[0].account.followers;
            //console.log("User Stats: " + JSON.stringify(userResults));

            res.render('user/followers', {
                count: data.length,
                followers: data,
                hasOneResult: (data.length < 2),
                //userStats: userResults,
                isDetailsPage: true,
                channel: channel,
                account: account
            });
        });
    });

    // Get friends
    app.express.get('/friends/channel/:channel/account/:account/id/:id', function (req, res, next) {
        var id = req.params.id;
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
                account: account,
                channel: channel,
            });
        });
    });


    // Get stats
    app.express.get('/stats/channel/:channel/client/:client', function (req, res, next) {
        var client = req.params.client;
        var channel = req.params.channel;

        app.webservice.users.get({client: client}, function (err, users) {
            console.log("Got " + users.length);
            console.log(JSON.stringify(users));
            var account = users[0].account;

            app.webservice.accounts.getone({client: users[0].client, account: users[0].account}, function (err, account) {

                console.log("account: " + account);

                var preparedResults = [];
                preparedResults = account.map(getLatestResultById);

                Promise.all(preparedResults).then(function (preparedResults) {
                    console.log("Prepared Results: " + JSON.stringify(preparedResults));
                    //console.log("Length: " + preparedResults.length);
                    // save results globally to use for graphs
                    userResults = preparedResults;

                    res.render('user/stats', {
                        count: users.length,
                        results: users,
                        hasOneResult: (users.length < 2),
                        client: client,
                        channel: channel,
                        //count: preparedResults.length,
                        latestResults: preparedResults,
                        isStatsPage: true,
                        isDetailsPage: false
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