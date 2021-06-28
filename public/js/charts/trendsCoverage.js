// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.trendsCoverage = {};

window.Chart.defaults.global.defaultFontSize = 10;

const acquisition = document.getElementById('acquisition');

async function handleLocationChange() {
  const nodes = await window.aq.getNodes();
  const countyCitiesMap = await window.sheets.getCountyCitiesMap();

  const allCountyNodes = Object.entries(countyCitiesMap)
    .map(([countyName, countyCities]) => {
      const countyNodes = nodes.filter(({ location }) =>
        countyCities.some(
          (city) =>
            location && location.city && location.city.indexOf(city) >= 0
        )
      );
      return { name: countyName, value: countyNodes };
    })
    // Don't show counties with 0 nodes
    .filter(({ value }) => value.length !== 0)
    .flatMap((node) => node?.value)
    .flatMap((node) => node?.sensors)
    .flatMap((node) => node?.sensordatas)
    // eslint-disable-next-line func-names
    .reduce(function (h, obj) {
      // eslint-disable-next-line no-param-reassign
      h[obj?.timestamp.split('T')[0]] = (
        h[obj?.timestamp.split('T')[0]] || []
      ).concat(obj);
      return h;
    }, {});

  const getDataAndSensorTypes = Object.entries(allCountyNodes).map((node) => {
    return {
      date: node[0],
      sensorTypes: node[1]
        .flatMap((sensor) => sensor?.sensordatavalues)
        // eslint-disable-next-line func-names
        .filter((item) => item.value_type === 'P2')
        // eslint-disable-next-line func-names
        .reduce(function (h, obj) {
          // eslint-disable-next-line no-param-reassign
          h[obj?.value_type] = (h[obj?.value_type] || []).concat(obj);
          // eslint-disable-next-line no-console
          return h;
        }, {}),
    };
  });
  // eslint-disable-next-line no-console
  console.log(getDataAndSensorTypes);

  /*  .reduce(function (h, obj) {
    // eslint-disable-next-line no-param-reassign
    h[obj?.value_type] = (h[obj?.value_type] || []).concat(obj);
    // eslint-disable-next-line no-console
    return h;
  }, {}), */

  window.aq.charts.trendsCoverage.el = new window.Chart(acquisition, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
      labels: ['4 Jan', '5 Jan', '6 Jan', '7 Jan', '8 Jan', '9 Jan', '10 Jan'],
      datasets: [
        {
          label: 'Nairobi',
          backgroundColor: '#9EE6BE',
          data: [78, 88, 68, 74, 50, 55, 25],
          lineTension: 0.3,
          pointBackgroundColor: '#9EE6BE',
          pointHoverBackgroundColor: 'rgba(76, 132, 255,1)',
          pointHoverRadius: 3,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded',
        },
        {
          label: 'Mpala',
          backgroundColor: '#4BD288',
          data: [0, 0, 0, 0, 0, 73, 0],
          lineTension: 0.3,
          pointBackgroundColor: '#4BD288',
          pointHoverBackgroundColor: 'rgba(254, 196, 0,1)',
          pointHoverRadius: 3,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded',
        },
        {
          label: 'Elgeyo-Marakwet',
          backgroundColor: '#2DB469',
          data: [0, 0, 0, 0, 0, 0, 0],
          lineTension: 0.3,
          pointBackgroundColor: '#2DB469',
          pointHoverBackgroundColor: 'rgba(41, 204, 151,1)',
          pointHoverRadius: 3,
          pointHitRadius: 30,
          pointBorderWidth: 2,
          pointStyle: 'rectRounded',
        },
      ],
    },
    // Configuration options go here
    options: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              display: false,
            },
          },
        ],
        yAxes: [
          {
            gridLines: {
              display: true,
            },
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      tooltips: {},
    },
  });
}

window.aq.charts.trendsCoverage.handleLocationChange = handleLocationChange;
