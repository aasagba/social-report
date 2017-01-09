'use strict';

var moment = require('moment');

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

    register('dateFormat', function (date) {
        console.log("date before: " + JSON.stringify(date));
        var dateObj = new Date(date);

        var day = ("0" + dateObj.getDate()).slice(-2);
        var month = ("0" + (dateObj.getMonth() + 1)).slice(-2);
        var year = dateObj.getFullYear();

        var dateFormatted = day + "/" + month + "/" + year;
        console.log("dateFormatted: " + dateFormatted);

        return dateFormatted;

        //return dateObj.toDateString();
    });

    // Format a date with Moment
    register('date-format', function (context, block) {
        var format = block.hash.format || 'YYYY-MM-DD HH:mm:ss';
        return moment(context).format(format);
    });
}