// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.countyCoverage = {};

window.Chart.defaults.global.defaultFontSize = 10;
const graph = document.getElementById('graph').getContext('2d');

async function handleLocationChange() {
  const nodes = await window.aq.getNodes();
  const countyCitiesMap = await window.sheets.getCountyCitiesMap();
  const { labels, data } = Object.entries(countyCitiesMap)
    .map(([countyName, countyCities]) => {
      const countyNodes = nodes.filter(({ location }) =>
        countyCities.some(
          (city) =>
            location && location.city && location.city.indexOf(city) >= 0
        )
      );
      return { name: countyName, value: countyNodes.length };
    })
    // Don't show counties with 0 nodes
    .filter(({ value }) => value)
    .reduce(
      (acc, { name, value }) => {
        acc.labels.push(name);
        acc.data.push(value);
        return acc;
      },
      { labels: [], data: [] }
    );

  window.aq.charts.countyCoverage.el = new window.Chart(graph, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [
        {
          label: 'Population en M ',
          data,
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
          ctx.font = window.Chart.helpers.fontString(
            window.Chart.defaults.global.defaultFontFamily,
            'normal',
            window.Chart.defaults.global.defaultFontFamily
          );
          ctx.textAlign = 'center';
          ctx.textBaseline = 'bottom';
          this.data.datasets.forEach((dataset) => {
            for (let i = 0; i < dataset.data.length; i += 1) {
              const model =
                // eslint-disable-next-line no-underscore-dangle
                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
              // eslint-disable-next-line no-underscore-dangle
              const { total } = dataset._meta[Object.keys(dataset._meta)[0]];
              const midRadius =
                model.innerRadius + (model.outerRadius - model.innerRadius) / 2;
              const { startAngle } = model;
              const { endAngle } = model;
              const midAngle = startAngle + (endAngle - startAngle) / 2;
              const x = midRadius * Math.cos(midAngle);
              const y = midRadius * Math.sin(midAngle);
              ctx.fillStyle = '#fff';
              const percent = `${String(
                Math.round((dataset.data[i] / total) * 100)
              )}%`;
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
}

window.aq.charts.countyCoverage.handleLocationChange = handleLocationChange;
