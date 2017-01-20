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

    register('flag', function (context, context2) {
        console.log("context: " + context);
        console.log("context2: " + context2);
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
            {country: "es", url: "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png"},
            {country: "Iberia", url: "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png"},
            {country: "Barcelona", url: "http://lfi.littleforest.co.uk/crawler/images/es%20flag.png"},
            {country: "Paris", url: "http://lfi.littleforest.co.uk/crawler/images/fr%20flag.png"},
            {country: "Canada", url: "http://lfi.littleforest.co.uk/crawler/images/ca%20flag.png"},
            {country: "India", url: "http://lfi.littleforest.co.uk/crawler/images/in%20flag.png"},
            {country: "Italy", url: "http://lfi.littleforest.co.uk/crawler/images/it%20flag.png"},
            {country: "Milano", url: "http://lfi.littleforest.co.uk/crawler/images/it%20flag.png"},
            {country: "Japan", url: "http://lfi.littleforest.co.uk/crawler/images/jp%20flag.png"},
            {country: "Korea", url: "http://lfi.littleforest.co.uk/crawler/images/kr%20flag.png"},
            {country: "Malaysia", url: "http://lfi.littleforest.co.uk/crawler/images/my%20flag.png"},
            {country: "Mexico", url: "http://lfi.littleforest.co.uk/crawler/images/mx%20flag.png"},
            {country: "México", url: "http://lfi.littleforest.co.uk/crawler/images/mx%20flag.png"},
            {country: "Amsterdam", url: "http://lfi.littleforest.co.uk/crawler/images/nl%20flag.png"},
            {country: "Netherlands", url: "http://lfi.littleforest.co.uk/crawler/images/nl%20flag.png"},
            {country: "NL", url: "http://lfi.littleforest.co.uk/crawler/images/nl%20flag.png"},
            {country: "Canada", url: "http://lfi.littleforest.co.uk/crawler/images/ca%20flag.png"},
            {country: "Turkey", url: "http://lfi.littleforest.co.uk/crawler/images/tr%20flag.png"},
            {country: "Turkiye", url: "http://lfi.littleforest.co.uk/crawler/images/tr%20flag.png"},
            {country: "Türkiye", url: "http://lfi.littleforest.co.uk/crawler/images/tr%20flag.png"},
            {country: "Herndon", url: "http://lfi.littleforest.co.uk/crawler/images/us%20flag.png"},
            {country: "America", url: "http://lfi.littleforest.co.uk/crawler/images/us%20flag.png"},
            {country: "US", url: "http://lfi.littleforest.co.uk/crawler/images/us%20flag.png"}
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
                console.log("match: " + context);
                return countries[i].url;
            } else if (context2.indexOf(countries[i].country) !== -1) {
                console.log("match: " + context2);
                return countries[i].url;
            }
        }

        return "";
    });
}