'use strict';

module.exports = route;
var bodyParser = require('body-parser');


function route (app) {
    var globalScores = {};

    var processScores = function (user,index) {
        console.log("in getResultById");
        return new Promise(function(resolve, reject) {
            app.webservice.user(user._id).results({}, function (err, results) {

                if (err || !results) {
                    user.last_result = null;
                }

                if (results) {
                    //console.log("results returned: " + JSON.stringify(results));
                    //console.log("number results: " + results.length);
                    user.last_result = results[0];

                    switch (user.last_result.channel) {
                        case "twitter":
                            console.log("Twitter account found: " + user.last_result.followers_count);
                            globalScores.twitter.followers += user.last_result.followers_count;
                            globalScores.twitter.friends += user.last_result.friends_count;
                            globalScores.twitter.favourites += user.last_result.favourites_count;
                            globalScores.twitter.posts += user.last_result.statuses_count;
                            break;
                        default :
                    }
                }

                resolve(user.last_result);
            });
        });
    };

    app.express.get('/client/:client', function (req, res, next) {

        var client = req.params.client;
        globalScores = {
            twitter: {
                followers: 0,
                friends: 0,
                favourites: 0,
                posts: 0
            },
            facebook: {
                followers: 0,
                friends: 0,
                favourites: 0,
                posts: 0
            },
            linkedin: {
                followers: 0,
                friends: 0,
                favourites: 0,
                posts: 0
            },
            total: {
                followers: 0,
                friends: 0,
                favourites: 0,
                posts: 0
            }
        };

        app.webservice.accounts.get({client: client}, function (err, users) {
            if (err) {
                return next(err);
            }

            var results = users.map(processScores);

            Promise.all(results).then(function (data) {

                globalScores.total.favourites += sum(globalScores.twitter.favourites,
                    globalScores.facebook.favourites, globalScores.linkedin.favourites);
                globalScores.total.followers += sum(globalScores.twitter.followers,
                    globalScores.facebook.followers, globalScores.linkedin.followers);
                globalScores.total.friends += sum(globalScores.twitter.friends,
                    globalScores.facebook.friends, globalScores.linkedin.friends);
                globalScores.total.posts += sum(globalScores.twitter.posts,
                    globalScores.facebook.posts, globalScores.linkedin.posts);

                console.log(JSON.stringify(globalScores));
                res.render('index', {
                    channels: [
                        {
                            client: "BSI",
                            channel: "Twitter",
                            scores: globalScores.twitter
                        },
                        {
                            client: "BSI",
                            channel: "Facebook",
                            scores: globalScores.facebook
                        },
                        {
                            client: "BSI",
                            channel: "Linkedin",
                            scores: globalScores.linkedin
                        }
                    ],
                    totalScores: globalScores.total

                });
            });
        });
    });
}

function sum () {
    var s = 0;
    for (var i=0; i < arguments.length; i++) {
        s += arguments[i];
    }
    return s;
}
