'use strict';

var chalk = require('chalk');

// Routes relating to all users
module.exports = function (app) {
    var model = app.model;

    return [

        /*******************************************************************
         WEB-SERVICE WELCOME MESSAGE
         *******************************************************************/
        {
            method: 'GET',
            path: '/',
            handler: function (req) {
                req.reply("Welcome to the LFI Social-Report-Webservice").code(200);
            }
        },

        /*******************************************************************
         Dashboard Totals
         *******************************************************************/
        {
            method: 'GET',
            path: '/globalscores',
            handler: function (req) {
                req.reply().code(200);
            }
        },

        {
            method: 'GET',
            path: '/run/friends',
            handler: function (req) {
                //console.log("req.query.account: " + req.query.account);
                model.friends.processFriends(req.query.account, req.query.accountname, function (err, friends) {
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        req.reply(friends).code(200);
                    }
                });
            }
        },

        {
            method: 'GET',
            path: '/friends',
            handler: function (req) {
                console.log("req.query.account: " + req.query.account);
                model.friends.getFriends(req.query.account, function (err, friends) {
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        req.reply(friends).code(200);
                    }
                });
            }
        },

        /*******************************************************************
         GET FOLLOWERS FROM DB BY ACCOUNT


         eg http://127.0.0.1:8000/followers?account=5846e35970e91934bb4bb3ac
         *******************************************************************/
       {
            method: 'GET',
            path: '/followers',
            handler: function (req) {
                //console.log("req.query.account: " + req.query.account);
                model.followers.getFollowers(req.query.account, function (err, followers) {
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        req.reply(followers).code(200);
                    }
                });
            }
        },

        /*******************************************************************
         RUN GET FOLLOWERS SERVICE AND POPULATE DB

         Get Posts for user
         eg http://127.0.0.1:8000/followers?account=5846e35270e91934bb4bb3ab&accountname=BSI_Brazil
         *******************************************************************/
        {
            method: 'GET',
            path: '/run/followers',
            handler: function (req) {
                //console.log("req.query.account: " + req.query.account);
                model.followers.processFollowers(req.query.account, req.query.accountname, function (err, followers) {
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        req.reply(followers).code(200);
                    }
                });
            }
        },

        /*******************************************************************
         TIMELINE STATUSES SERVICE

         Get Posts for user
         eg http://127.0.0.1:8000/posts/user/account/5846e35270e91934bb4bb3ab?channel=twitter&client=BSI_Brazil
         *******************************************************************/
        {
            method: 'GET',
            path: '/posts/user/account/{account}',
            handler: function (req) {
                model.posts.getPostTimeline(req.params.account, req.query.channel, req.query.client, function (err, posts) {
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        req.reply(posts).code(200);
                    }
                });
            }
        },

        /*******************************************************************
         GET POSTS FROM DB BY ACCOUNT


         eg http://127.0.0.1:8000/posts?account=5846e35270e91934bb4bb3ab
         *******************************************************************/
        {
            method: 'GET',
            path: '/posts',
            handler: function (req) {
                //console.log("req.query.account: " + req.query.account);
                model.posts.getPosts(req.query.account, function (err, followers) {
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        req.reply(followers).code(200);
                    }
                });
            }
        },

        {
        /*******************************************************************
            RUN USER LOOKUP SERVICE

            Will run user lookup service and store results in DB
            eg http://127.0.0.1:8000/user/run?client=BSI
         *******************************************************************/

            method: 'GET',
            path: '/user/run',
            handler: function (req) {
                var client = req.query.client;
                //var channel = req.query.channel;

                // put channel as field in users collection and remove argument below

                model.users.getAll(client, function (err, users) {
                    console.log(client);
                    if (err) {
                        return req.reply().code(500);
                    } else {
                        model.user.runByClient(users, function (err, results) {
                            if (err) {
                                return req.reply().code(500);
                            } else {
                                req.reply("Successfully Ran Lookup for " + client + " accounts.").code(200);
                                //req.reply().code(202);
                            }
                        });
                    }
                });

            }
        },

        {
        /*******************************************************************
            RETURN USER LOOKUP RESULTS

            Will return user lookup results from DB
            eg. http://127.0.0.1:8000/user/results?client=BSI

         *******************************************************************/
            method: 'GET',
            path: '/user/results',
            handler: function (req) {
                var client = req.query.client;
                console.log("In /user/results");
                model.user.getByClient(client, function (err, results) {
                   if (err) {
                       return req.reply().code(500);
                   }
                    req.reply(results).code(200);
                });
            }
        },

        {
        /*******************************************************************
         RETURN USER LOOKUP RESULTS

         Will return user lookup results from DB
         eg. http://127.0.0.1:8000/user/results?client=BSI

         *******************************************************************/
        method: 'GET',
            path: '/user/{id}/results',
            handler: function (req) {
                model.user.getResultById(req.params.id, req.query, function (err, results) {
                   if (err || !results) {
                       return req.reply().code(500);
                   }
                    req.reply(results).code(200);
                });

            }

        }
    ];

};



// hardocoded results
/*var results = [

 {
 "accountid": "",
 "name": "BSI UK",
 "screenName": "BSI_UK",
 "channel": "twitter",
 "location": "London,UK",
 "description": "The UK’s national standards body & the business standards company providing services in knowledge, assurance (including the Kitemark) and compliance",
 "followers_count": 14084,
 "friends_count": 996,
 "favourites_count": 490,
 "statuses_count": 5105,
 "latest_status_date": "Tue Dec 06 14:46:47 +0000 2016",
 "latest_status": "First to achieve #BIMKitemark for Design and Construction @balfourbeatty @BAMContractors @BAMConstructUK @gammon_hk… https://t.co/sV11ktPZc7"
 },
 {
 "accountid": "",
 "name": "BSI Brasil",
 "screenName": "BSI_Brazil",
 "channel": "twitter",
 "location": "Sao Paulo, Brazil",
 "description": "BSI Brasil, a empresa de gestão de negócios fornecedora de normas e serviços relacionados a conhecimento, garantia e conformidade.",
 "followers_count": 7,
 "friends_count": 1,
 "favourites_count": 1,
 "statuses_count": 3,
 "latest_status_date": "Wed Aug 31 07:21:56 +0000 2016",
 "latest_status": "RT @BSI_UK: Last week’s UK horsemeat scandal arrests are a reminder to stay vigilant about food fraud. https://t.co/KWs0I4MYzr https://t.co…"
 },
 {
 "accountid": "",
 "name": "BSI France",
 "screenName": "BSI_France",
 "channel": "twitter",
 "location": "Paris, France",
 "description": "Organisme de notification pour les dispositifs médicaux #CE et de certification sur les #normes #ISO13485 #ISO27001 #ISO9001 #ISO14001 #ISO22301 #ISO45001 #ISO",
 "followers_count": 312,
 "friends_count": 776,
 "favourites_count": 90,
 "statuses_count": 496,
 "latest_status_date": "Tue Dec 06 15:00:26 +0000 2016",
 "latest_status": "First BIM Kitemark paves way for new era of digital technology in construction https://t.co/SdQ2oolDtJ Vía BSI_press"
 },
 {
 "accountid": "",
 "name": "BSI Australia NZ",
 "screenName": "BSI_AustraliaNZ",
 "channel": "twitter",
 "location": "Australia and NZ",
 "description": "BSI Australia and NZ, the business standards company providing standards and related services in knowledge, assurance and compliance",
 "followers_count": 180,
 "friends_count": 605,
 "favourites_count": 4,
 "statuses_count": 69,
 "latest_status_date": "Mon Oct 17 00:36:57 +0000 2016",
 "latest_status": "#IATF16949 new quality management system for the automotive industry is published. Find out more today: https://t.co/5OppZqUBBs"
 }

 ];

 req.reply(results).code(200);*/