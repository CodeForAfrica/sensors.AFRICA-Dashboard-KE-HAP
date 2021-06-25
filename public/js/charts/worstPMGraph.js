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
          label: '# of Nodes',
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
  const averageAll = {};

  dataValues.forEach((value) => {
    // Get the readings of the P1,2 and 0 values
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

// helper function
const getAverage = (AQReading, type) => {
  const total = AQReading.map((result) => result[type]);
  const average =
    total.reduce((result1, result2) => result1 + result2, 0) / total.length;

  return average;
};

function returnPMAverage(sensors) {
  const sensorAverages = [];

  sensors.forEach((sensor) => {
    const resultAverages = sensor.sensordatas
      .map((data) => {
        return readingAverage(data.sensordatavalues);
      })
      .filter((data) => Object.keys(data).length !== 0); // remove zero values

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
  const resultAverages = [...window.aq.charts.worstNodes.pmAverages];

  // sort by pm type
  const typeSorted = resultAverages.sort(
    (result1, result2) => result2[type] - result1[type]
  );

  // Highest 5 nodes of pm type
  const topFiveNodes = typeSorted.splice(0, 5);

  const labels = Object.keys(topFiveNodes);
  const data = Object.values(topFiveNodes).map(
    (worstNodes) => worstNodes[type]
  );

  renderWorstNodesChart(labels, data);
};

async function worstPMNodes() {
  const nodes = await window.aq.getNodes();

  const nodePMAverages = nodes.map((data) => {
    let averageResults = returnPMAverage(data.sensors);

    if (averageResults.length > 0) {
      // get average if more than one sensor has data
      const p1 = getAverage(averageResults, 'p1');
      const p2 = getAverage(averageResults, 'p2');
      const p0 = getAverage(averageResults, 'p0');

      averageResults = [{ p1, p2, p0 }];
    }

    const updatedNode = { ...averageResults[0], city: data.location.city }; // for county check

    return updatedNode;
  });

  // store for aq change
  window.aq.charts.worstNodes.pmAverages = nodePMAverages;

  PMTopFiveChart('p2');
  document.getElementById('pmtypes').disabled = false;
}

window.aq.charts.worstNodes.worstPMNodes = worstPMNodes;
