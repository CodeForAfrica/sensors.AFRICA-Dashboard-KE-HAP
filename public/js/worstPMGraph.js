let PVal = [];

function filterLevel(dataValues) {
  console.log('VALUES', dataValues);
  return dataValues.forEach((value) => {
    if (
      value.value_type === 'P2' ||
      value.value_type === 'P1' ||
      value.value_type === 'P0'
    ) {
      console.log('OONE');
      PVal.push(value.value);
      return PVal;
    }
    return null;
  });
}

function returnHighestPM(sensors) {
  return sensors.forEach((sensor) => {
    return sensor.sensordatas.forEach((data) => {
      console.log('DATA', data);
      return filterLevel(data.sensordatavalues);
    });
  });
}

function worstPMNodes() {
  console.log('WORST NODES', results);
  const resultsData = results.results;

  resultsData.forEach((data) => {
    console.log('HIGHEEEEST', returnHighestPM(data.sensors));
  });
}

var ctx = document.getElementById('myChart').getContext('2d');
var myChart = new Chart(ctx, {
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
