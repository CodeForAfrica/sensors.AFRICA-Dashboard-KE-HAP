function worstPMNodes() {
  console.log('WORST NODES');
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
