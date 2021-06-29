const getAnalytics = async (county) => {
  const pm1Elem = document.querySelector('.pm1-range .title');
  const pm2Elem = document.querySelector('.pm2-5-range .title');
  const pm0Elem = document.querySelector('.pm10-range .title');
  const noiseElem = document.querySelector('.noise-range .title');

  pm1Elem.innerHTML = 0;
  pm2Elem.innerHTML = '0';
  pm0Elem.innerHTML = '0';
  noiseElem.innerHTML = 0;

  const rangeMap = {
    pm1: { high: 0, low: 0 },
    pm2: { high: 0, low: 0 },
    pm0: { high: 0, low: 0 },
    noise: { high: 0, low: 0 },
  };

  const getValue = (sensorReading) => {
    const updateMap = (type, data) => {
      rangeMap[type].high =
        Number(data.value) > rangeMap[type].high
          ? Number(data.value)
          : rangeMap[type].high;
      if (rangeMap[type].low === 0) {
        rangeMap[type].low = Number(data.value);
      } else {
        rangeMap[type].low =
          Number(data.value) < rangeMap[type].low
            ? Number(data.value)
            : rangeMap[type].low;
      }
    };
    sensorReading.forEach((reading) => {
      reading.sensordatavalues.forEach((data) => {
        switch (data.value_type) {
          case 'P1':
            updateMap('pm1', data);
            break;
          case 'P2':
            updateMap('pm2', data);
            break;
          case 'P0':
            updateMap('pm0', data);
            break;
          case 'noise_Leq':
            updateMap('noise', data);
            break;
          default:
            break;
        }
      });
    });
  };
  const nodes = await window.aq.getNodes();
  const counties = await window.sheets.getCityCountyMap();

  const selectedCounty = nodes.filter((node) => {
    return counties[node.location.city] === county;
  });

  const sensorData = selectedCounty
    ?.map((node) => node.sensors)
    ?.map((data) => data.map((result) => result.sensordatas));

  sensorData?.forEach((data) => {
    data?.forEach((result) => getValue(result));
  });

  if (selectedCounty) {
    const { pm1, pm2, pm0, noise } = rangeMap;

    pm1Elem.innerHTML = `${pm1.low}-${pm1.high}`;
    pm2Elem.innerHTML = `${pm2.low}-${pm2.high}`;
    pm0Elem.innerHTML = `${pm0.low}-${pm0.high}`;
    noiseElem.innerHTML = `${noise.low}-${noise.high}`;
  }
};

window.analytics = {
  getAnalytics,
};
