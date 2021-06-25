// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.worstNodes = {};

const ctx = document.getElementById('myChart').getContext('2d');

const renderWorstNodesChart = (labels, data) => {
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
};

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

      sensorAverages.push({ p1, p2, p0 });
    }
  });

  return sensorAverages;
}

const PMTopFiveChart = async (type) => {
  // fetch data
  const resultAverages = [...window.aq.charts.worstNodes.pmAverages];
  const cityCountiesMap = await window.sheets.getCityCountyMap();

  // sort by pm type
  const typeSorted = resultAverages.sort(
    (result1, result2) => result2[type] - result1[type]
  );

  // get top 5 nodes here
  const topFiveNodes = typeSorted.splice(0, 5);

  // map to county
  const topWorst = {};

  topFiveNodes.forEach((node) => {
    if (cityCountiesMap[node.city] !== undefined) {
      if (!topWorst[cityCountiesMap[node.city]]) {
        topWorst[cityCountiesMap[node.city]] = [node];
      } else {
        topWorst[cityCountiesMap[node.city]] = [
          ...topWorst[cityCountiesMap[node.city]],
          node,
        ];
      }
    }
  });

  const labels = Object.keys(topWorst);
  const data = Object.values(topWorst).map((worstNodes) => worstNodes.length);
  renderWorstNodesChart(labels, data);
};

async function worstPMNodes() {
  const nodes = await window.aq.getNodes(); // get the nodes

  const resultAverages = nodes.map((data) => {
    // store the no of sensors in a node
    const averageResults = returnPMAverage(data.sensors);

    if (averageResults.length > 0) {
      // do an average here
    }

    // add its city
    const updatedNode = { ...averageResults[0], city: data.location.city };

    return updatedNode;
  });

  // store for aq change
  window.aq.charts.worstNodes.pmAverages = resultAverages;

  PMTopFiveChart('p2');
  document.getElementById('pmtypes').disabled = false;
}

window.aq.charts.worstNodes.worstPMNodes = worstPMNodes;
