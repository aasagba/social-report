'use strict';

module.exports = helper;

function helper (register) {

    // convert a string to lower-case
    register('lowercase', function (context) {
       return context.toLowerCase();
    });
}