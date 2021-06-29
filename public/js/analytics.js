const getAnalytics = () => {
  const rangeMap = {
    pm1: { high: 0, low: 0 },
    pm2: { high: 0, low: 0 },
    pm0: { high: 0, low: 0 },
    noise: { high: 0, low: 0 },
  };

  const getValue = (sensorReading) => {
    const { pm1, pm2, pm0, noise } = rangeMap;
    sensorReading.forEach((reading) => {
      reading.sensordatavalues.forEach((data) => {
        switch (data.value_type) {
          case 'P1':
            pm1.high =
              Number(data.value) > pm1.high ? Number(data.value) : pm1.high; // Extract to helper function. Repetitively ugly
            if (pm1.low === 0) {
              pm1.low = Number(data.value);
            } else {
              pm1.low =
                Number(data.value) < pm1.low ? Number(data.value) : pm1.low;
            }
            break;
          case 'P2':
            pm2.high =
              Number(data.value) > pm2.high ? Number(data.value) : pm2.high;
            if (pm2.low === 0) {
              pm2.low = Number(data.value);
            } else {
              pm2.low =
                Number(data.value) < pm2.low ? Number(data.value) : pm2.low;
            }
            break;
          case 'P0':
            pm0.high =
              Number(data.value) > pm0.high ? Number(data.value) : pm0.high;
            if (pm0.low === 0) {
              pm0.low = Number(data.value);
            } else {
              pm0.low =
                Number(data.value) < pm0.low ? Number(data.value) : pm0.low;
            }
            break;
          case 'noise_Leq':
            noise.high =
              Number(data.value) > noise.high ? Number(data.value) : noise.high;
            if (noise.low === 0) {
              noise.low = Number(data.value);
            } else {
              noise.low =
                Number(data.value) < noise.low ? Number(data.value) : noise.low;
            }
            break;
          default:
            break;
        }
      });
    });
  };
  const nodes = window.db.getItem('nodes');

  // Loop
  const sensorData = nodes
    .map((node) => node.sensors)
    .map((data) => data.map((result) => result.sensordatas));

  sensorData.forEach((data) => {
    data.forEach((result) => getValue(result));
  });

  const { pm1, pm2, pm0, noise } = rangeMap;
  const pm1Elem = document.querySelector('.pm1-range .title');
  pm1Elem.innerHTML = `${pm1.high}-${pm1.low}`;

  const pm2Elem = document.querySelector('.pm2-5-range .title');
  pm2Elem.innerHTML = `${pm2.high}-${pm2.low}`;

  const pm0Elem = document.querySelector('.pm10-range .title');
  pm0Elem.innerHTML = `${pm0.high}-${pm0.low}`;

  const noiseElem = document.querySelector('.noise-range .title');
  noiseElem.innerHTML = `${noise.high}-${noise.low}`;
};

window.analytics = {
  getAnalytics,
};
