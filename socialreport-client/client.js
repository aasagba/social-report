'use strict';

var request = require('request');

module.exports = client;

// Create a web-service client
function client (root) {
    return {

        accounts: {
            // Get all social users
            get: function (query, done) {
                get(root + 'users/accounts', query, done);
            },

            followers: function (query, done) {
                get(root + 'followers', query, done);
            }
        },

        users: {
            // Create a new social user
            create: function (user, done) {
                post(root + 'users', user, done);
            },

            // Get user lookup for all client accounts
            get: function (query, done) {
                get(root + 'user/results', query, done);
            },

            run: function (query, done) {
                get(root + 'user/run', query, done);
            }
        },

        posts: function (id) {
            return {
                // Get Post timeline for user
                get: function (query, done) {
                    get(root + 'user/account/' + id, query, done);
                }
            }
        },

        user: function (id) {
            return {

                // Get user lookup for one account
                get: function (query, done) {
                    get(root + 'user/results/' + id, query, done);
                },

                run: function (query, done) {
                    post(root + '/user/run/' + id, query, done);
                },

                results: function (query, done) {
                    get(root + 'user/' + id + '/results', query, done);
                }

            };
        }
        /*
         user: function (id) {
         return {

         run: function () {
         get(root + 'user/' + query, done);
         },
         // Get a social user
         get: function (query, done) {
         get(root + 'users/' + id, query, done);
         },

         // Edit a social user
         edit: function (edits, done) {
         patch(root + 'users/' + id, edits, done);
         },

         // Remove a social user
         remove: function (done) {
         del(root + 'users/' + id, null, done);
         }
         };
         }*/
    };
}

// Perform a DELETE request
function del (url, query, done) {
    req('DELETE', url, query, null, done);
}

// Perform a GET request
function get (url, query, done) {
    req('GET', url, query, null, done);
}

// Perform a PATCH request
function patch (url, body, done) {
    req('PATCH', url, null, body, done);
}

// Perform a POST request
function post (url, body, done) {
    req('POST', url, null, body, done);
}

// Perform a request
function req (method, url, query, body, done) {
    console.log(method, url, query, body);
    request({
        method: method,
        url: url,
        qs: query,
        body: body,
        json: true
    }, function (err, res, body) {

        if (err) {
            return done(err);
        }
        if (res.statusCode > 299) {
            var message = (body && body.message ? body.message : 'Error ' + res.statusCode);
            return done(new Error(message));
        }
        done(null, body);
    });

    /*
     console.log(method, url, query, body);
     body = {
     user: "testuser",
     posts: 12,
     followers: 20,
     friend: 22
     };
     done(null,body);*/
}
