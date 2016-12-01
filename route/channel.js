'use strict';

module.exports = route;
var Promise = require('bluebird');
var createTwitterClient = require('./channel/twitter');
// create twitter cient
var twitterClient = createTwitterClient();

function route (app) {

    // Get Post Timeline
    app.express.get('/channel/:channel/:user', function (req, res, next) {
        console.log("in /channel/:channel/:user");
        var channel = req.params.channel.toLowerCase();
        var user = req.params.channel.toLowerCase();
        var options = {screen_name: 'BSI_UK', count:200};
        var action = "statuses/user_timeline";

        app.webservice.posts(user).get({client: user}, function (err, posts) {
            console.log("posts from webservice: ");
            console.log(JSON.stringify(posts));

            res.render('user/posts', {
                count: posts.length,
                posts: posts,
                channel: channel
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


    // Get User Lookup
    app.express.get('/channel/:channel', function (req, res, next) {
        var channel = req.params.channel.toLowerCase();
        console.log("in /channel/" + channel);

        var userInfo = [];
        var user = "BSI";

        app.webservice.users.get({client: user}, function (err, user) {
            console.log("user from webservice: ");
            //console.log(JSON.stringify(user));

            res.render('user/user', {
                count: user.length,
                users: user,
                channel: channel
            });
        });

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

}

/*
 getBearer(function (error) {
 if (error) {
 console.log("Error getting Authentication token");
 }
 });
 */