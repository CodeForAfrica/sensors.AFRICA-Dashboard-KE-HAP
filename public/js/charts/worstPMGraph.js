// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.worstNodes = {};

const ctx = document.getElementById('myChart').getContext('2d');

function readingAverage(dataValues) {
  // get total of AQ recordings
  const recordings = dataValues.length;

  let average = 0;
  let sum = 0;

  dataValues.forEach((value) => {
    // loop through the values and sum the total of the P1,2 and 0 values
    if (
      value.value_type === 'P2' ||
      value.value_type === 'P1' ||
      value.value_type === 'P0'
    ) {
      // sum them up
      sum += Number(value.value);
    }
  });

  // if the sum shows the respective AQ nodes exist, get their average.
  if (sum > 0) {
    average = sum / recordings;
  }
  // else return 0
  return average;
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
      .filter((data) => data !== 0); // remove zero values

    // if data exists, get average of sensor recordings at different times
    if (resultAverages.length) {
      const sum = resultAverages.reduce(
        (result1, result2) => result1 + result2,
        0
      );

      const average = sum / resultAverages.length;

      sensorAverages.push(average);
    }
  });

  return sensorAverages;
}

async function worstPMNodes() {
  const nodes = await window.aq.getNodes(); // get the nodes
  // const countyCitiesMap = await window.sheets.getCountyCitiesMap(); // counties

  const averageNodes = {};

  nodes.forEach((data) => {
    // store the no of sensors in a node
    const averageResults = returnPMAverage(data.sensors);
    const nodeAverage = averageResults / averageResults.length;
    averageNodes[data.location.location] = nodeAverage; //TODO: record the averages per nodes in a county
  });

  console.log(averageNodes);

  window.aq.charts.worstNodes.el = new window.Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Nairobi', 'Homa Bay', 'Siaya', 'Nakuru', 'Laikipia'],
      datasets: [
        {
          label: '# of Sensors',
          data: [12, 19, 3, 5, 2],
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
