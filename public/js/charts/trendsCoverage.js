// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.trendsCoverage = {};

window.Chart.defaults.global.defaultFontSize = 10;

const acquisition = document.getElementById('acquisition');

async function handleLocationChange() {
  const nodes = await window.aq.getNodes();
  const countyCitiesMap = await window.sheets.getCountyCitiesMap();
  function getAvg(sensor) {
    const total = sensor.reduce((acc, c) => acc + c, 0);
    return total / sensor.length;
  }
  // Format dates from nodes
  function formatDate(date, langCode) {
    const dateObj = new Date(date);
    const day = dateObj.toLocaleString(langCode, { day: '2-digit' }); // DD
    const month = dateObj.toLocaleString(langCode, { month: 'short' }); // MMM
    return `${day} ${month}`;
  }
  // get chartlabels for the week in an array
  const labels = [...Array(7)]
    .map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - i);
      return d;
    })
    .map((item) => formatDate(item, 'en-US'))
    .slice()
    .sort((a, b) => new Date(a).getTime() - new Date(b).getTime());

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

  const getDateAndSensorTypes = Object.entries(allCountyNodes).map((node) => {
    return {
      date: formatDate(node[0], 'en-US'),
      sensorTypes: node[1]
        .flatMap((sensor) => sensor?.sensordatavalues)
        // eslint-disable-next-line func-names
        .filter((item) => item?.value_type === 'P2')
        // eslint-disable-next-line func-names
        .reduce(function (h, obj) {
          // eslint-disable-next-line no-param-reassign
          h[obj?.value_type] = (h[obj?.value_type] || []).concat(obj);
          // eslint-disable-next-line no-console
          return h;
        }, {}),
    };
  });
  const filteredP2Data = getDateAndSensorTypes.filter((item) =>
    labels.find((data) =>
      data?.toLowerCase().trim().includes(item.date?.toLowerCase().trim())
    )
  );
  // eslint-disable-next-line consistent-return
  labels.forEach((date) => {
    if (!filteredP2Data.find((item) => item.date === date)) {
      return filteredP2Data.push({ date, sensorTypes: [] });
    }
  });
  const P2Data = filteredP2Data
    .slice()
    .sort((a, b) => new Date(a?.date).getTime() - new Date(b?.date).getTime())
    .map(
      // eslint-disable-next-line no-console
      (item) =>
        item?.sensorTypes?.P2 === undefined
          ? 0
          : item?.sensorTypes?.P2.map((sensor) => Number(sensor.value))
    )
    .map((item) => (item === 0 ? 0 : Math.round(getAvg(item))));
  window.aq.charts.trendsCoverage.el = new window.Chart(acquisition, {
    // The type of chart we want to create
    type: 'line',
    // The data for our dataset
    data: {
      labels,
      datasets: [
        {
          label: 'Nairobi',
          backgroundColor: '#9EE6BE',
          data: P2Data,
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
          data: [0, 0, 0, 0, 0, 0, 0],
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
