/* eslint-disable camelcase */
/* eslint-disable no-underscore-dangle */
/* eslint-disable func-names */
/* eslint-disable no-undef */
// NOTE: requires('sheets');
// NOTE: requires('aq');

window.aq.charts.sensorCoverage = {};
window.Chart.defaults.global.defaultFontSize = 10;
const sensorsChart = document
  .getElementById('sensorsCoverage')
  .getContext('2d');
async function handleLocationChange() {
  const nodes = await window.aq.getNodes();
  const countyCitiesMap = await window.sheets.getCountyCitiesMap();
  const allCountyNodes = Object.entries(countyCitiesMap)
    .map(([countyName, countyCities]) => {
      const countyNodes = nodes.filter(({ location }) =>
        countyCities.some(
          (city) =>
            location && location.city && location.city.indexOf(city) >= 0
        )
      );
      return { name: countyName, value: countyNodes };
    })
    // Don't show counties with 0 nodes
    .filter(({ value }) => value.length !== 0)
    .flatMap((node) => node?.value)
    .flatMap((node) => node?.sensors)
    .flatMap((node) => node?.sensordatas)
    .flatMap((node) => node?.sensordatavalues)
    // eslint-disable-next-line func-names
    .reduce(function (sensorDatas, obj) {
      // eslint-disable-next-line no-param-reassign
      sensorDatas[obj?.value_type] = (
        sensorDatas[obj?.value_type] || []
      ).concat(obj);
      return sensorDatas;
    }, {});
  const sensorCoverageData = Object.keys(allCountyNodes)
    .map((key) => {
      return {
        sensor: key,
        sensorAvg: Math.round(
          allCountyNodes[key].reduce((a, b) => a + (Number(b.value) || 0), 0) /
            allCountyNodes[key].length
        ),
      };
    })
    .filter(
      (sensorType) =>
        sensorType.sensor !== 'timestamp' &&
        sensorType.sensor !== 'height' &&
        sensorType.sensor !== 'lon' &&
        sensorType.sensor !== 'lat'
    )
    .map((item) => item.sensorAvg);

  window.aq.charts.sensorCoverage.el = new Chart(sensorsChart, {
    type: 'doughnut', // bar, horizontalBar, pie, line, doughnut, radar, polarArea
    data: {
      labels: ['PM2.5', 'PM10', 'PM1', 'Humidity', 'Temperature', 'NoiseLeq'],
      datasets: [
        {
          label: ' ',
          data: sensorCoverageData,
          backgroundColor: [
            '#339961',
            '#38a86b',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
          ],
          borderColor: [
            '#339961',
            '#38a86b',
            '#57C789',
            '#85D6A9',
            '#A3E0BF',
            '#c0ead3',
          ],
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
          this.data.datasets.forEach(function (dataset) {
            for (let i = 0; i < dataset.data.length; i++) {
              const model =
                dataset._meta[Object.keys(dataset._meta)[0]].data[i]._model;
              const { total } = dataset._meta[Object.keys(dataset._meta)[0]];
              const mid_radius =
                model.innerRadius + (model.outerRadius - model.innerRadius) / 2;
              const start_angle = model.startAngle;
              const end_angle = model.endAngle;
              const mid_angle = start_angle + (end_angle - start_angle) / 2;
              // eslint-disable-next-line vars-on-top
              const x = mid_radius * Math.cos(mid_angle);
              const y = mid_radius * Math.sin(mid_angle);
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
      // start at 0
    },
  });
}

window.aq.charts.sensorCoverage.handleLocationChange = handleLocationChange;
