const graph = document.getElementById('graph').getContext('2d');
Chart.defaults.global.defaultFontSize = 10;

const countyGraphChange = (county) => {
  // filter Nairobi. This will be used to populate the chart when counties are available
  const currentCounty = results.results.filter((result) => {
    return result.location.city.includes(county);
  });

  // no of nodes in Nairobi and total nodes
  const countyNodes = currentCounty.length;
  const totalNodes = results.count;

  new Chart(graph, {
    type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: [county, 'Other'],
      datasets: [
        {
          label: 'Population en M ',
          data: [countyNodes, totalNodes - countyNodes],
          // backgroundColor: "blue",
          backgroundColor: ['#38a86b', '#85D6A9'],
          borderColor: ['#38a86b', '#85D6A9'],
          hoverBorderWidth: 3,
        },
      ],
    },
    options: {
      cutoutPercentage: 70,
      radius: '50%',
      animation: {
        duration: 500,
        easing: 'easeOutQuart',
        onComplete: function () {
          var ctx = this.chart.ctx;
          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontFamily,
            'normal',
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach(function (dataset) {
            for (var i = 0; i < dataset.data.length; i++) {
              var model =
                  dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model,
                total = dataset._meta[Object.keys(dataset._meta)[0]].total,
                mid_radius =
                  model.innerRadius +
                  (model.outerRadius - model.innerRadius) / 2,
                start_angle = model.startAngle,
                end_angle = model.endAngle,
                mid_angle = start_angle + (end_angle - start_angle) / 2;
              var x = mid_radius * Math.cos(mid_angle);
              var y = mid_radius * Math.sin(mid_angle);
              ctx.fillStyle = '#fff';
              var percent =
                String(Math.round((dataset.data[i] / total) * 100)) + '%';
              ctx.fillText(dataset.data[i], model.x + x, model.y + y);
              ctx.fillText(percent, model.x + x, model.y + y + 15);
            }
          });
        },
      },
      legend: {
        display: true,
        position: 'bottom',
        align: 'start',
      },
    },
  });
};
