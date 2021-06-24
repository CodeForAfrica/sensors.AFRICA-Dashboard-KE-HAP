// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.worstNodes = {};

const ctx = document.getElementById('myChart').getContext('2d');

function readingAverage(dataValues) {
  // get total of AQ recordings

  const averageAll = {};

  dataValues.forEach((value) => {
    // loop through the values and get the readings of the P1,2 and 0 values

    switch (value.value_type) {
      case 'P1':
        averageAll.p1 = Number(value.value);
        break;
      case 'P2':
        averageAll.p2 = Number(value.value);
        break;
      case 'P0':
        averageAll.p0 = Number(value.value);
        break;
      default:
        break;
    }
  });

  return averageAll;
}

function returnPMAverage(sensors) {
  // store response
  const sensorAverages = [];

  // loop through the sensors array and access the sensorsdatas array
  sensors.forEach((sensor) => {
    const resultAverages = sensor.sensordatas
      .map((data) => {
        // pass down the sensordatavalues to filter method
        return readingAverage(data.sensordatavalues);
      })
      .filter((data) => Object.keys(data).length !== 0); // remove zero values

    const getAverage = (AQReading, type) => {
      const total = AQReading.map((result) => result[type]);
      const average =
        total.reduce((result1, result2) => result1 + result2, 0) / total.length;

      return average;
    };

    // if data exists, get average of sensor recordings at different times
    if (resultAverages.length) {
      const p1 = getAverage(resultAverages, 'p1');
      const p2 = getAverage(resultAverages, 'p2');
      const p0 = getAverage(resultAverages, 'p0');

      // const sum = resultAverages.reduce(
      //   (result1, result2) => result1 + result2,
      //   0
      // );
      // const average = sum / resultAverages.length;
      // sensorAverages.push(average);
    }
  });

  return sensorAverages;
}

async function worstPMNodes() {
  const nodes = await window.aq.getNodes(); // get the nodes
  const cityCountiesMap = await window.sheets.getCityCountyMap();

  const averageNodes = {};

  nodes.forEach((data) => {
    // store the no of sensors in a node
    const averageResults = returnPMAverage(data.sensors);
    const nodeAverage = averageResults / averageResults.length;

    // populate map TODO: Should check for data in nodeAverage first
    if (cityCountiesMap[data.location.city] !== undefined) {
      if (!averageNodes[cityCountiesMap[data.location.city]]) {
        averageNodes[cityCountiesMap[data.location.city]] = {
          nodes: [nodeAverage],
          sum: 0,
        };
      } else {
        averageNodes[cityCountiesMap[data.location.city]].nodes = [
          ...averageNodes[cityCountiesMap[data.location.city]].nodes,
          nodeAverage,
        ];
        averageNodes[cityCountiesMap[data.location.city]].sum =
          (averageNodes[cityCountiesMap[data.location.city]].sum *
            (averageNodes[cityCountiesMap[data.location.city]].nodes.length -
              1) +
            nodeAverage) /
          averageNodes[cityCountiesMap[data.location.city]].nodes.length;
      }
    }
  });

  // Sort using sum
  const resultSorted = Object.fromEntries(
    Object.entries(averageNodes).sort(([, a], [, b]) => b.sum - a.sum)
  );

  const labels = Object.keys(resultSorted).splice(0, 5);
  const data = Object.values(resultSorted)
    .splice(0, 5)
    .map((result) => result.nodes.length);

  window.aq.charts.worstNodes.el = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: '# of Sensors',
          data,
          backgroundColor: [
            '#2DB469',
            '#2DB469',
            '#2DB469',
            '#2DB469',
            '#2DB469',
          ],
          borderWidth: 1,
        },
      ],
    },
    options: {
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
      },
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
    },
  });
}

window.aq.charts.worstNodes.worstPMNodes = worstPMNodes;
