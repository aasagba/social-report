'use strict';

module.exports = route;
var Promise = require('bluebird');
var createTwitterClient = require('./channel/twitter');
// create twitter cient
var twitterClient = createTwitterClient();

function route (app) {

    // Get Post Timeline
    app.express.get('/channel/:channel/account/:account', function (req, res, next) {
        console.log("in /channel/:channel/account/:account");
        var channel = req.params.channel.toLowerCase();
        var account = req.params.account.trim().toUpperCase();
        account = account.replace(/ /g,"_");
        var options = {screen_name: 'BSI_UK', count:200};
        var action = "statuses/user_timeline";
        console.log("account: " + account);
        console.log("Channel: " + channel);

        app.webservice.posts(account).get({channel: channel, client: account}, function (err, posts) {
            console.log("posts from webservice: ");
            console.log(posts.length);

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
    app.express.get('/channel/:channel/client/:client', function (req, res, next) {
        var channel = req.params.channel.toLowerCase();
        var client = req.params.client.toLowerCase();
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

        // NEED TO WRITE CODE TO HIT /USER/RUN TO POPULATE SOCIAL METRICS

        // NEED TO WRITE CODE TO GET USER LOOKUP VIA /USER/RESULTS
        app.webservice.user.get({client: client, channel: channel}, function (err, users) {
            console.log("Got " + users.length + " Users from Webservice for the " + channel + " channel.");

            console.log(JSON.stringify(users));

            res.render('user/user', {
                count: users.length,
                users: users,
                channel: channel
            });
        });
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

}

/*
 getBearer(function (error) {
 if (error) {
 console.log("Error getting Authentication token");
 }
 });
 */