'use strict';

module.exports = helper;

function helper (register) {

    // convert a string to lower-case
    register('lowercase', function (context) {
       return context.toLowerCase();
    });

    // convert a string to upper-case
    register('uppercase', function (context) {
        return context.toUpperCase();
    });

    register('trend', function (context) {

        if (context < 0) {
            return "down";
        } else if (context > 0) {
            return "up"
        } else {
            return "nochange"
        }

    });

    register('trendarrow', function (context) {

        if (context < 0) {
            return "fa-arrow-down";
        } else if (context > 0) {
            return "fa-arrow-up"
        } else {
            return "nochange"
        }

    });
}