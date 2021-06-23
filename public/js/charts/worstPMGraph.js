// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.worstNodes = {};

const ctx = document.getElementById('myChart').getContext('2d');

function filterLevel(dataValues) {
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

  return average;
}

function returnHighestPM(sensors) {
  // store response
  const sensorAverages = [];

  // loop through the sensors array and access the sensorsdatas array
  sensors.forEach((sensor) => {
    const result = sensor.sensordatas.map((data) => {
      // pass down the sensordatavalues to filter method and location
      return filterLevel(data.sensordatavalues);
    });

    const refinedArray = result.filter((data) => data !== 0);

    // if data exists, get average of both recordings at different times
    if (refinedArray.length) {
      const sum = refinedArray.reduce(
        (result1, result2) => result1 + result2,
        0
      );

      const average = sum / refinedArray.length;

      sensorAverages.push(average);
    }
  });

  return sensorAverages;
}

async function worstPMNodes() {
  const nodes = await window.aq.getNodes(); // get the results array
  // const countyCitiesMap = await window.sheets.getCountyCitiesMap(); // counties

  const averageNodes = {};

  nodes.forEach((data) => {
    // store the no of sensors in a node
    const averageResults = returnHighestPM(data.sensors);
    const totalAverage = averageResults / averageResults.length;
    averageNodes[data.location.location] = totalAverage;
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
