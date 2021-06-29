const getAnalytics = () => {
  const rangeMap = {
    pm1: { high: 0, low: 0 },
    pm2: { high: 0, low: 0 },
    pm0: { high: 0, low: 0 },
    noise: { high: 0, low: 0 },
  };

  const getValue = (sensorReading) => {
    sensorReading.forEach((reading) => {
      reading.sensordatavalues.forEach((data) => {});
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
};

window.analytics = {
  getAnalytics,
};
