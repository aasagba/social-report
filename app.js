var Promise = require('bluebird');
var twitter = require('twitter');
var express = require('express');
var EventEmitter = require('events').EventEmitter;
var app = express();
var http = require('http');
//require('Authentication');
var async = require('async');
var hbs = require('express-hbs');
var compression = require('compression');
var chalk = require('chalk');
var bodyParser = require('body-parser');
var createClient = require('./socialreport-client/client');

module.exports = initApp;

// Initialise the application
function initApp (config, callback) {

    var webserviceUrl = config.webservice;
    if (typeof webserviceUrl == 'object') {
        //webserviceUrl = 'http://127.0.0.1:3000/';
        webserviceUrl = 'http://' + webserviceUrl.host + ':' + webserviceUrl.port + '/';
    }

    var app = new EventEmitter();
    app.address = null;
    app.express = express();
    app.server = http.createServer(app.express);
    app.webservice = createClient(webserviceUrl);

    // Compression
    app.express.use(compression());

    // Public files
    app.express.use(express.static(__dirname + '/public'));

    // General express config
    app.express.use(bodyParser.json({ type: 'application/*+json' }));

    // View Engine
    //app.express.set('view', __dirname + '/view');
    app.express.engine('html', hbs.express3({
        extname: '.html',
        contentHelperName: 'content',
        layoutsDir: __dirname + '/view/layout',
        partialsDir: __dirname + '/view/partial',
        defaultLayout: __dirname + '/view/layout/default',
    }));
    app.express.set('views', __dirname + '/view');
    app.express.set('view engine', 'html');

    // View helpers

    // Populate view locals
    app.express.locals = {
        lang: 'en',
    };

    app.express.use(function (req, res, next) {
        res.locals.isHomePage = (req.path === '/');
        res.locals.host = req.hostname;
        next();
    });

    // Load routes
    require('./route/index')(app);
    require('./route/channel')(app);

    // Error handling
    app.express.get('*', function (req, res) {
        res.status(404);
        res.render('404');
    });

    app.express.use(function (err, req, res, next) {
        app.emit('route-error', err);

        res.status(500);
        res.render('500');
        exit();
    });

    app.server.listen(process.env.PORT || 7000, function (err) {
        var address = app.server.address();
        app.address = 'http://' + address.address + ':' + address.port;
        callback(err, app);
    });
}

var exit = function exit () {
    setTimeout(function () {
        process.exit(1);
    }, 0);
};

/* Error Handling

process.on( 'SIGINT', function() {
    console.log( '\nGracefully shutting down from SIGINT (Ctrl-C)' );
    process.exit( );
});

process.on('uncaughtException', function (err) {
    console.error(err.stack);
    console.log("Node NOT Exiting...");
    process.exit(1);
});

app.listen(process.env.PORT || 6000);
console.log("Social Report running on port 6000");
exports = module.exports = app;
 */