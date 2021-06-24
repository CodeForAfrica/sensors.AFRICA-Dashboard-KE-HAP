// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.trendsChartCoverage = {};

window.Chart.defaults.global.defaultFontSize = 10;

var acquisition = document.getElementById('acquisition');

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


    window.aq.charts.trendsChartCoverage.el =  new Chart(acquisition, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
        labels: ["4 Jan", "5 Jan", "6 Jan", "7 Jan", "8 Jan", "9 Jan", "10 Jan"],
        datasets: [
        {
          label: "Nairobi",
          backgroundColor: '#9EE6BE',
          data: [78, 88, 68, 74, 50, 55, 25],
          lineTension: 0.3,
          pointBackgroundColor: '#9EE6BE',
          pointHoverBackgroundColor: 'rgba(76, 132, 255,1)',
          pointHoverRadius: 3,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded'
        },
          {
          label: "Mpala",
          backgroundColor: '#4BD288',
          data: [88, 108, 78, 95, 65, 73, 42],
          lineTension: 0.3,
          pointBackgroundColor: '#4BD288',
          pointHoverBackgroundColor: 'rgba(254, 196, 0,1)',
          pointHoverRadius: 3,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded'
        },
          {
          label: "Elgeyo-Marakwet",
          backgroundColor: '#2DB469',
          data: [103, 125, 95, 110, 79, 92, 58],
          lineTension: 0.3,
          pointBackgroundColor: '#2DB469',
          pointHoverBackgroundColor: 'rgba(41, 204, 151,1)',
          pointHoverRadius: 3,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded'
        }
      ]
    },
    // Configuration options go here
    options: {
     legend: {
      display: true,
      position:'bottom',
      align:'start'
    },
      scales: {
        xAxes: [{
          gridLines: {
            display:false
          }
        }],
        yAxes: [{
          gridLines: {
             display:true
          },
          ticks: {
             beginAtZero: true,
          },
       }]
     },
     tooltips: {
    }
  }
})};

window.aq.charts.trendsChartCoverage.handleLocationChange = handleLocationChange;

