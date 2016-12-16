'use strict';

module.exports = route;
var Promise = require('bluebird');
var createTwitterClient = require('./channel/twitter');
// create twitter cient
var twitterClient = createTwitterClient();

function route (app) {

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
                }

                resolve(user);
            });
        });
    };


    // Get Post Timeline
    app.express.get('/posts/account/:account', function (req, res, next) {
        console.log("in /posts/account/:account");
        var account = req.params.account;
        console.log("account: " + account);

        //app.webservice.posts(account).get({channel: channel, client: account}, function (err, posts) {
        app.webservice.accounts.posts({account: account}, function (err, posts) {
            console.log("posts from webservice: ");
            console.log(posts.length);

            res.render('user/posts', {
                count: posts.length,
                posts: posts,
                channel: "twitter"
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



            Promise.all(preparedResults).then(function (preparedResults) {
                console.log("Prepared Results: " + JSON.stringify(preparedResults));
                console.log("Length: " + preparedResults.length);
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
    app.express.get('/followers/account/:account', function (req, res, next) {
        var account = req.params.account;

        app.webservice.accounts.followers({account: account}, function (err, followers) {
            if (err) {
                return next(err);
            }

            res.render('user/followers', {
                count: followers.length,
                followers: followers
            });
        });
    });

    // Get friends
    app.express.get('/friends/account/:account', function (req, res, next) {
        var account = req.params.account;

        app.webservice.accounts.friends({account: account}, function (err, friends) {
            if (err) {
                return next(err);
            }
            console.log("Friends: " + JSON.stringify(friends));

            res.render('user/friends', {
                count: friends.length,
                friends: friends
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