const graph = document.getElementById('graph').getContext('2d');
Chart.defaults.global.defaultFontSize = 10;

const countyGraphChange = async (county) => {
  const kenyaCounties = [
    'Nairobi',
    'Kwale',
    'Mombasa',
    'Kilifi',
    'Tana River',
    'Lamu',
    'Taita Taveta',
    'Garissa',
    'Wajir',
    'Mandera',
    'Marsabit',
    'Isiolo',
    'Tharaka Nithi',
    'Meru',
    'Embu',
    'Kitui',
    'Machakos',
    'Makueni',
    'Nyanadarua',
    'Nyeri',
    'Kirinyaga',
    'Muranga',
    'Kiambu',
    'Turkana',
    'West Pokot',
    'Samburu',
    'Trans Nzoia',
    'Uasin Gishu',
    'Elgeyo Marakwet',
    'Nandi',
    'Baringo',
    'Laikipia',
    'Nakuru',
    'Marok',
    'Kajiado',
    'Kericho',
    'Bomet',
    'Kakamega',
    'Vihiga',
    'Bungoma',
    'Busia',
    'Siaya',
    'Kisumu',
    'Homa Bay',
    'Migori',
    'Kisii',
    'Nyamira',
  ];
  const countyData = await getCounties();

  let countiesMap = {};

  // Map total nodes per county. This will be used to populate the chart when counties are available
  results.results.filter((result) => {
    const cityCounty = getCityCounty(result.location.city, countyData);

    // map of nodes per county
    if (cityCounty) {
      if (!countiesMap[cityCounty]) {
        countiesMap[cityCounty] = '1';
      } else {
        countiesMap[cityCounty] = Number(countiesMap[cityCounty]) + 1;
      }
    }

    return cityCounty === county;
  });

  const newArr = new Array(47 - Object.keys(countiesMap).length).fill(0); // populate the rest of the counties with 0 nodes

  // Array of counties
  const countiesArr = [
    ...new Set([...Object.keys(countiesMap), ...kenyaCounties]),
  ];
  // Array of nodes in counties
  const countiesDataArr = [...Object.values(countiesMap), ...newArr];

  new Chart(graph, {
    type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: countiesArr,
      datasets: [
        {
          label: 'Population en M ',
          data: countiesDataArr,
          // backgroundColor: "blue",
          backgroundColor: [
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
          ],
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
