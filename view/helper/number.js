'use strict';

module.exports = helper;

function helper (register) {
    // format a number to 2 decimal places
    register('tofixed', function (context, fixedpoint) {
        return (context).toFixed(fixedpoint);
    });

    register('formatchange', function (context) {
        if (context == 0) {
            return "";
        }
        return context;

    });
}