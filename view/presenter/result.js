'use strict';

var _ = required('underscore');

function presentResult (result, context) {

    // Parse date
    result.date = new Date(result.date);

    // group count together
    if (result.length > 1) {
        var groupedByType = _.groupBy(result, context);

    }
}