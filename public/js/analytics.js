const pm1Elem = document.querySelector('.pm1-range .title');
const pm2Elem = document.querySelector('.pm2-5-range .title');
const pm0Elem = document.querySelector('.pm10-range .title');
const noiseElem = document.querySelector('.noise-range .title');

const getAnalytics = async (county) => {
  pm1Elem.innerHTML = 0;
  pm2Elem.innerHTML = 0;
  pm0Elem.innerHTML = 0;
  noiseElem.innerHTML = 0;

  const rangeMap = {
    P1: { high: 0, low: 0 },
    P2: { high: 0, low: 0 },
    P0: { high: 0, low: 0 },
    noise_Leq: { high: 0, low: 0 },
  };

  const getValue = (sensorReading) => {
    const updateMap = (data) => {
      if (rangeMap[data.value_type]) {
        rangeMap[data.value_type].high =
          Number(data.value) > rangeMap[data.value_type].high
            ? Number(data.value)
            : rangeMap[data.value_type].high;
        if (rangeMap[data.value_type].low === 0) {
          rangeMap[data.value_type].low = Number(data.value);
        } else {
          rangeMap[data.value_type].low =
            Number(data.value) < rangeMap[data.value_type].low
              ? Number(data.value)
              : rangeMap[data.value_type].low;
        }
      }
    };
    sensorReading.forEach((reading) => {
      reading.sensordatavalues.forEach((data) => {
        updateMap(data);
      });
    });
  };
  const nodes = await window.aq.getNodes();
  const cityCountyMap = await window.sheets.getCityCountyMap();

  const selectedCountyNodes = nodes.filter((node) => {
    return cityCountyMap[node.location.city] === county;
  });

  const sensorData = selectedCountyNodes
    ?.map((node) => node.sensors)
    ?.map((data) => data.map((result) => result.sensordatas));

  sensorData?.forEach((data) => {
    data?.forEach((result) => getValue(result));
  });

  if (selectedCountyNodes) {
    const { P1, P2, P0, noise_Leq: noise } = rangeMap;

    pm1Elem.innerHTML = `${P1.low}-${P1.high}`;
    pm2Elem.innerHTML = `${P2.low}-${P2.high}`;
    pm0Elem.innerHTML = `${P0.low}-${P0.high}`;
    noiseElem.innerHTML = `${noise.low}-${noise.high}`;
  }
};

window.analytics = {
  getAnalytics,
};
