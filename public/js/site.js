$(document).ready(function() {

    var data = {};
    var zoomResetButton = $('[data-role="zoom-reset"]');
    var graphContainer = $('[data-role="graph"]');
    var legend = graphContainer.parent('.graph-container').find('.dashedLegend');

    var graphOptions = {
        series: {
            dashes: { show: false, lineWidth: 3 },
            lines: { show: true },
            points: { show: true },
            hoverable: true
        },
        xaxis: {
            mode: 'time',
            tickLength: 0,
            minTickSize: [1, 'day'],
            timeformat: '%d %b'
        },
        yaxis: {
            tickDecimals: 0
        },
        lines: {
            lineWidth: 3
        },
        points: {
            fill: true,
            radius:4,
            lineWidth:3
        },
        shadowSize: 0,
        grid: {
            backgroundColor: '#fff',
            borderColor: '#808080',
            hoverable: true,
            clickable: true,
            borderWidth: {
                top: 1,
                right: 1,
                bottom: 1,
                left: 1
            }
        },
        selection: {
            mode: 'x'
        }
    };

    // have we declared a custom legend
    console.log("Legend Length: " + legend.prevObject.length);
    console.log(JSON.stringify(legend));
    if (legend.prevObject.length === 1) {
        $('body').addClass('custom-legend');
    }

    zoomResetButton.click(function () {
        getGraphData();
        plotGraphData();
    });

    $.each(graphContainer, function(){
        getGraphData();
        plotGraphData();
    });

    function getGraphData() {
        $($('[data-role="stats"]').get().reverse()).each(function () {
           var el = $(this);
            storeDatum(el, getAxisLabel(el));
        });
    }

    function getAxisLabel (el) {
        return el.find('[data-role="date"]').attr('data-value');
    }

    function storeDatum (el, label) {
        $.each(el.find('[data-label]'), function () {
            var type = $(this).attr('data-label');
            var value = $(this).html();
            if (typeof data[type] === 'undefined') {
                data[type] = [];
            }
            data[type].push([label, + value]);
        });
    }


    function plotGraphData () {
        $.plot(graphContainer, getData(), graphOptions);
    }

    function getData () {
        return [
            {
                color: 'rgb(216, 61, 45)',
                label: 'Followers',
                data: data.followers
            },
            {
                color: 'rgb(168, 103, 0)',
                label: 'Friends',
                data: data.friends,
                lines: { show: true },
                dashes: { show: true, dashLength: [10,5] }
            },
            {
                color: 'rgb(23, 123, 190)',
                label: 'Favourites',
                data: data.favourites,
                lines: { show: true },
                dashes: { show: true, dashLength: [10, 5] }
            },
            {
                color: 'rgb(0, 102, 0)',
                label: 'Statuses',
                data: data.statuses,
                lines: { show: true },
                dashes: { show: true, dashLength: [5] }
            },
        ]
    }

    function toggleResetZoomButton () {
        zoomResetButton.toggleClass('hidden');
    }

    graphContainer.bind('plotselected', function (event, ranges) {
        // clamp the zooming to prevent eternal zoom
        if (ranges.xaxis.to - ranges.xaxis.from < 0.00001) {
            ranges.xaxis.to = ranges.xaxis.from + 0.00001;
        }
        if (ranges.yaxis.to - ranges.yaxis.from < 0.00001) {
            ranges.yaxis.to = ranges.yaxis.from + 0.00001;
        }

        // do zooming
        plot = $.plot(graphContainer, getData(ranges.xaxis.from, ranges.xaxis.to),
            $.extend(true, {}, graphOptions, {
                xaxis: { min: ranges.xaxis.from, max: ranges.xaxis.to },
                yaxis: { min: ranges.yaxis.from, max: ranges.yaxis.to }
            })
        );
        if (!zoomResetButton.is(':visible')) {
            toggleResetZoomButton();
        }
    });

    var choiceContainer = $('[data-role="series-checkboxes"]');
    var datasets = getData();

    $.each(datasets, function (key, val) {
       var lowerCaseValue = (val.label.substring(0, val.label.length - 1)).toLowerCase();
        choiceContainer.append(
            '<li class="text-center ' + lowerCaseValue + '">' +
                '<div class="series-checkbox-container">' +
                    '<input type="checkbox"' +
                        'name="' + key + '" ' +
                        'id="id' + key + '" ' +
                        'data-stat-type="' + val.label.toLowerCase() + '"' +
                        '/>' +
                    '<label for="id' + key + '">' +
                        '<span class="stat-type">' + val.label + '</span>' +
                    '</label>' +
                '</div>' +
            '</li>'
        );
    });

    choiceContainer.find('input').click(plotAccordingToChoices);
    choiceContainer.find('[data-stat-type=followers]').click();
   // if (choiceContainer.find('input')) {
    if (document.getElementsByTagName("input").length > 0) {
        plotAccordingToChoices();
    }

    function plotAccordingToChoices() {

        var data = [];
        var labels = [];
        choiceContainer.find('input:checked').each(function () {
           var key = $(this).attr('name');
            console.log("Key: " + key);
            console.log("Datasets[key]: " + JSON.stringify(datasets[key]));
            if (key && datasets[key]) {
                labels.push(datasets[key].label);
                data.push(datasets[key]);
            }
        });
        console.log("labels: " + labels.length);
        console.log("labels content: " + JSON.stringify(labels));
        console.log("legend: " + legend.prevObject.length);
        console.log("");


        if (labels.length && legend.prevObject.length === 1) {
            console.log("in");
            legend.find('tr').hide();
            $.each(labels, function (index, value) {
                console.log(".legend" + value);
                $('.legend' + value).parents('tr').show();
            });
            //legend.show();
            $('.dashedLegend').show();
            console.log("End");
        } else {
            legend.hide();
        }
        console.log("Data length: " + data.length);
        if (data.length > -1) {
            $.plot(graphContainer, data, graphOptions);
        }
    }

    function showTooltip(x, y, contents) {
        $('<div data-role="tooltip" class="tooltip tooltip-graph in"><div class="tooltip-inner">' +
            contents +
            '</div></div>').css({top: y + 5,left: x + 5}).appendTo('body').fadeIn(200);
    }

    var previousPoint = null;
    graphContainer.bind('plothover', function (event, pos, item) {
        if (item) {
            if (previousPoint != item.dataIndex) {
                previousPoint = item.dataIndex;
                $('[data-role="tooltip"]').remove();
                var count = item.datapoint[1].toFixed(0);
                var date = $.plot.formatDate(new Date(item.datapoint[0]), '%d %b' +
                '<small> (%H:%M)</small>');
                var contents = '<p class="crunch">' +
                    date + '<br/>' +
                    count + ' ' + item.series.label +
                '</[h6]>';
                showTooltip(item.pageX, item.pageY, contents);
            }
        } else {
            $('[data-role="tooltip"]').remove();
            previousPoint = null;
        }
    });




});