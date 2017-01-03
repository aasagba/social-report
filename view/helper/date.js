'use strict';

module.exports = helper;

function helper (register) {

    // convert a string to lower-case
    register('days-since', function (date) {

            var d = new Date(date);

            //Get 1 day in milliseconds
            var one_day=1000*60*60*24;
            var now = Date.now();
            var difference = now - d;
            var result = Math.round(difference/one_day);
            //console.log("Days between: " + result);

            return result;

    });

    register('datesubstring', function (date) {

        var dateFormatted = date.substring(0, 10);
        console.log(dateFormatted);
        dateFormatted.concat(date.substring(25, 4));
        console.log(dateFormatted);
        return dateFormatted;

    });
}