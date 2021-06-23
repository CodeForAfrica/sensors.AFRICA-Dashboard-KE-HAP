// NOTE: requires('sheets');
// NOTE: requires('aq');


window.aq.charts.sensorCoverage = {};
window.Chart.defaults.global.defaultFontSize = 10;
const sensorsChart = document.getElementById("sensorsChart").getContext("2d");

async function handleLocationChange() {
    const nodes = await window.aq.getNodes();
    const countyCitiesMap = await window.sheets.getCountyCitiesMap();
    const { labels, data } = Object.entries(countyCitiesMap)
        .map(([countyName, countyCities]) => {
            const countyNodes = nodes.filter(({ location }) =>
                countyCities.some(
                    (city) =>
                        location && location.city && location.city.indexOf(city) >= 0
                )
            );
            console.log({ name: countyName, value: countyNodes });
            return { name: countyName, value: countyNodes.length };
        })
        // Don't show counties with 0 nodes
        .filter(({ value }) => value)
        .reduce(
            (acc, { name, value }) => {
                acc.labels.push(name);
                acc.data.push(value);
                return acc;
            },
            { labels: [], data: [] }
        );


    window.aq.charts.sensorCoverage.el = new Chart(sensorsChart, {
        type: "doughnut", // bar, horizontalBar, pie, line, doughnut, radar, polarArea
        data: {
            labels: [
                "PM1",
                "PM2.5",
                "PM10",
                "Air",
                "Temperature",
            ],
            datasets: [
                {
                    label: " ",
                    data: [6, 8, 3, 4, 4],
                    // backgroundColor: "blue",
                    backgroundColor: [
                        '#38a86b',
                        '#57C789',
                        "#85D6A9",
                        "#A3E0BF",
                        "#c0ead3",
                    ],
                    borderColor: ["#38a86b", "#57C789", "#85D6A9", "#A3E0BF", "#c0ead3"],
                    hoverBorderWidth: 3,
                },
            ],
        },
        options: {
            cutoutPercentage: 70,
            radius: "50%",
            animation: {
                duration: 500,
                easing: "easeOutQuart",
                onComplete: function () {
                    var ctx = this.chart.ctx;
                    ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontFamily, 'normal', Chart.defaults.global.defaultFontFamily);
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'bottom';
                    this.data.datasets.forEach(function (dataset) {
                        for (var i = 0; i < dataset.data.length; i++) {
                            var model = dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                                mid_radius = model.innerRadius + (model.outerRadius - model.innerRadius) / 2,
                                start_angle = model.startAngle,
                                end_angle = model.endAngle,
                                mid_angle = start_angle + (end_angle - start_angle) / 2;
                            var x = mid_radius * Math.cos(mid_angle);
                            var y = mid_radius * Math.sin(mid_angle);
                            ctx.fillStyle = '#fff';
                            var percent = String(Math.round(dataset.data[i] / total * 100)) + "%";
                            ctx.fillText(dataset.data[i], model.x + x, model.y + y);
                            ctx.fillText(percent, model.x + x, model.y + y + 15);
                        }
                    });
                }
            },
            legend: {
                display: true,
                position: 'bottom',
                align: 'start'
            },
            // start at 0
        },
    })
}

window.aq.charts.sensorCoverage.handleLocationChange = handleLocationChange;
