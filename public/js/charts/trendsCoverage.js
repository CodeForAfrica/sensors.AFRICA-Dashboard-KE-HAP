/* eslint-disable consistent-return */
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
  function formatDate(date) {
    const dateObj = new Date(date);
    return dateObj.toLocaleString('en-GB', { day: '2-digit', month: 'short' });
  }
  // get chartlabels for the current  week in an array
  const chartLabels = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d;
  }).map((item) => formatDate(item));
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
    .filter(({ value }) => value)
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

  // eslint-disable-next-line no-console
  const getDateAndSensorTypes = Object.entries(allCountyNodes).map((node) => {
    return {
      date: formatDate(node[0]),
      sensorTypes: node[1]
        .flatMap((sensor) => sensor?.sensordatavalues)
        .filter(
          (sensor) =>
            sensor?.value_type === 'P2' ||
            sensor?.value_type === 'P1' ||
            sensor?.value_type === 'P0'
        )
        // eslint-disable-next-line func-names
        .reduce(function (h, obj) {
          // eslint-disable-next-line no-param-reassign
          h[obj?.value_type] = (h[obj?.value_type] || []).concat(obj);
          return h;
        }, {}),
    };
  });

  const filteredP2Data = getDateAndSensorTypes.filter((item) =>
    chartLabels.find((data) =>
      data?.toLowerCase().trim().includes(item.date?.toLowerCase().trim())
    )
  );
  // eslint-disable-next-line consistent-return
  chartLabels.forEach((date) => {
    if (!filteredP2Data.find((item) => item.date === date)) {
      return filteredP2Data.push({ date, sensorTypes: [] });
    }
  });
  // Sort all Data
  const getAllSortedData = filteredP2Data
    .slice()
    .sort((a, b) => new Date(a?.date).getTime() - new Date(b?.date).getTime());

  // Return label, data values
  const labels = getAllSortedData.map((item) => item?.date);
  const data = getAllSortedData
    .map(
      // eslint-disable-next-line no-console
      (item) => ({
        P0:
          item?.sensorTypes?.P0 === undefined
            ? 0
            : item?.sensorTypes?.P0.map((sensor) => Number(sensor.value)),
        P1:
          item?.sensorTypes?.P1 === undefined
            ? 0
            : item?.sensorTypes?.P1.map((sensor) => Number(sensor.value)),
        P2:
          item?.sensorTypes?.P2 === undefined
            ? 0
            : item?.sensorTypes?.P2.map((sensor) => Number(sensor.value)),
      })
    )
    .map((item) => ({
      P0: item.P0 === 0 ? 0 : Math.round(getAvg(item.P0)),
      P1: item.P1 === 0 ? 0 : Math.round(getAvg(item.P1)),
      P2: item.P2 === 0 ? 0 : Math.round(getAvg(item.P2)),
    }));
  const getSelectedData = (sensorType) => {
    return data.map((item) => item[sensorType]);
  };
  // eslint-disable-next-line no-console
  console.log(getSelectedData('P1'));

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
          data: getSelectedData('P1'),
          lineTension: 0.3,
          pointBackgroundColor: '#9EE6BE',
          pointHoverBackgroundColor: 'rgba(76, 132, 255,1)',
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
