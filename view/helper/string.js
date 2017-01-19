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

    register('flag', function (context) {
/*
        var countries = ["UK","Brazil","France","Australia", "Spain", "España", "Jordan"];
        var url = "http://lfi.littleforest.co.uk/crawler/images/";

        countries.forEach(function (country) {
            if (context.indexOf(country) !== -1) {
                return url + country;
            }
        });*/

        /*var countryMap = new Map();
        countryMap.set("UK", "http://lfi.littleforest.co.uk/crawler/images/uk%20flag.png");
        countryMap.set("Brazil", "http://lfi.littleforest.co.uk/crawler/images/br%20flag.png");
        countryMap.set("France", "http://lfi.littleforest.co.uk/crawler/images/fr%20flag.png");
        countryMap.set("Australia", "http://lfi.littleforest.co.uk/crawler/images/au%20flag.png");
        countryMap.set("Spain", "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png");
        countryMap.set("España", "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png");*/

        var countries = [
            {country: "UK", url: "http://lfi.littleforest.co.uk/crawler/images/uk%20flag.png"},
            {country: "Brazil", url: "http://lfi.littleforest.co.uk/crawler/images/br%20flag.png"},
            {country: "France", url: "http://lfi.littleforest.co.uk/crawler/images/fr%20flag.png"},
            {country: "Australia", url: "http://lfi.littleforest.co.uk/crawler/images/au%20flag.png"},
            {country: "Spain", url:  "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png"},
            {country: "España", url: "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png"},
            {country: "Paris", url: "http://lfi.littleforest.co.uk/crawler/images/fr%20flag.png"}
        ];

        /*map.forEach(function(value, key) {
            console.log(key + " = " + value);
            if (context.indexOf(key) !== -1) {
                return url + value;
            }
        });*/

        var i = 0;
        var length = countries.length;

        for (i; i < length; i++) {
            if (context.indexOf(countries[i].country) !== -1) {
                return countries[i].url;
            }
        }
    });
}