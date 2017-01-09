'use strict';

module.exports = socialClient;

var createTwitterClient = require('../config/twitterclient');
// create twitter cient
var twitterClient = createTwitterClient();

function socialClient () {

    return {
        userLookup: function (user, done) {
            return new Promise(function (resolve, reject) {
                var channel = user.channel.toLowerCase();
                var result = null;
                // check channel and call appropriate client
                switch (channel) {
                    case "twitter":
                        // perform user lookup
                        result = twitterClient.userLookup(user);

                        break;
                    case "facebook":

                        break;
                    case "linkedin":

                        break;
                    default:

                }
/*
                var complete = Promise.all(result);

                complete.then(function (data) {
                    resolve(data);
                });*/
                resolve(result);

            });
        },

        getFollowers: function (action, user, done) {
            var result = null;

            return new Promise(function (resolve, reject) {
                result = twitterClient.getFollowers(action, user);
                resolve(result);
            });
        },

        getPostTimeline: function (channel, newaction, newoptions) {
            return new Promise(function (resolve, reject) {
                var result = twitterClient.getPostTimeline(channel, newaction, newoptions);
                resolve(result);
            });

        }
    }
}