const countyGraphChange = (county) => {
  // set it to Nairobi for now
  // county = "Nairobi";

  new Chart(graph, {
    type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: [county],
      datasets: [
        {
          label: 'Population en M ',
          data: [6],
          // backgroundColor: "blue",
          backgroundColor: [
            '#38a86b',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
          ],
          borderColor: ['#38a86b', '#57C789', '#85D6A9', '#A3E0BF', '#c0ead3'],
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

const handleLocationChange = async (value) => {
  countyGraphChange(value);

  const baseUrl = '/map/index.html/#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  const county = countiesLocation[value].name;
  const numberOfHouseholds = await getHouseHoldCount(county);

  document.getElementById('map-iframe').src = newUrl;
  document.getElementById('county-name').innerHTML = county;
  document.getElementById('county-households').innerHTML = numberOfHouseholds;
};
