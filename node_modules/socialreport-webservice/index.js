'use strict';

var chalk = require('chalk');
var config = require('./config/' + (process.env.NODE_ENV || 'development') + '.json');

require('./app')(config, function (err, app) {
    console.log("");
    console.log(chalk.underline.cyan('social-report started'));
    console.log(chalk.grey('mode: %s'), process.env.NODE_ENV);
    console.log(chalk.grey('uri: %s'), app.server.info.uri);

    if (err) {
        console.error("");
        console.error(chalk.red('Error starting social-report:'));
        console.error(err.message);
        console.error(err);
    }
});