const graph = document.getElementById('graph').getContext('2d');
Chart.defaults.global.defaultFontSize = 10;

const countyGraphChange = (county, countyData, results) => {
  const kenyaCounties = countyData.map((data) => data.name);

  let countiesMap = {};

  countiesMap[county] = '0';

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

  const countyGraphChart = new Chart(graph, {
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
        onComplete() {
          const { ctx } = this.chart;
          ctx.font = Chart.helpers.fontString(
            Chart.defaults.global.defaultFontFamily,
            'normal',
            Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach((dataset) => {
            for (let i = 0; i < dataset.data.length; i += 1) {
              const model =
                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
              const total = dataset._meta[Object.keys(dataset._meta)[0]].total;
              const midRadius =
                model.innerRadius + (model.outerRadius - model.innerRadius) / 2;
              const { startAngle } = model;
              const { endAngle } = model;
              const midAngle = startAngle + (endAngle - startAngle) / 2;
              const x = midRadius * Math.cos(midAngle);
              const y = midRadius * Math.sin(midAngle);
              ctx.fillStyle = '#fff';
              let percent =
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

const countyGraph = {
  results: 0,
  countyData: [],
  async fetchResults(county) {
    const data = await fetch('/api/data/?days=7');
    this.results = await data.json();

    const countyDataResponse = await getCounties();
    this.countyData = countyDataResponse;
    countyGraphChange(county, this.countyData, this.results);
  },
  changeCounty(county) {
    if (this.results) {
      countyGraphChange(county, this.countyData, this.results);
    }
  },
};
