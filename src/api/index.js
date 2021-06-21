import fetch from 'isomorphic-unfetch';
import Papa from 'papaparse';
import request from 'request';

const HUMIDITY_READING = 'humidity';
const TEMPERATURE_READING = 'temperature';
const P2_READING = 'P2';

const formatAirStats = (data, isPm2 = false) => {
  const formatted = {};
  ['average', 'maximum', 'minimum'].forEach((stat) => {
    const parsed = Number.parseFloat(data[stat]);
    if (isPm2 && stat === 'average') {
      formatted.averageDescription = `measurements not recorded`;
      if (!Number.isNaN(parsed)) {
        let difference = 25.0 - parsed;
        let position = 'below';
        if (parsed > 25.0) {
          difference = parsed - 25.0;
          position = 'above';
        }
        const percentage = ((difference / 25.0) * 100).toFixed(2);
        formatted.averageDescription = `${percentage}% ${position} the safe level`;
      }
    }
    formatted[stat] = Number.isNaN(parsed) ? '--' : parsed.toFixed(2);
  });
  return formatted;
};

const getFormattedStats = (data, reading) => {
  let statData = {};
  if (data && data.count === 1) {
    statData = data.results[0][reading];
  }
  return formatAirStats(statData, reading === P2_READING);
};

const getFormattedHumidityStats = (data) => {
  return getFormattedStats(data, HUMIDITY_READING);
};

const getFormattedP2Stats = (data) => {
  return getFormattedStats(data, P2_READING);
};

const getFormattedTemperatureStats = (data) => {
  return getFormattedStats(data, TEMPERATURE_READING);
};

const DATE_FMT_OPTIONS = {
  timeZone: 'UTC',
  weekday: 'short',
  day: 'numeric',
  month: 'short',
};

const formatWeeklyP2Stats = (data) => {
  const stats = [];
  // Start with the oldest value
  for (let i = data.length - 1; i >= 0; i -= 1) {
    let averagePM = Number.parseFloat(data[i].average);
    if (Number.isNaN(averagePM)) {
      averagePM = 0.0;
    }
    const date = new Date(data[i].start_datetime).toLocaleDateString(
      'en-US',
      DATE_FMT_OPTIONS
    );
    stats.push({ date, averagePM });
  }
  return stats;
};

const getFormattedWeeklyP2Stats = (data) => {
  const statData =
    (data && data.count === 1 && data.results[0][P2_READING]) || [];
  return formatWeeklyP2Stats(statData);
};

const CITIES_LOCATION = {
  nairobi: {
    slug: 'nairobi',
    latitude: '-1.2709',
    longitude: '36.8169',
    name: 'Nairobi',
    country: 'Kenya',
    label: 'Nairobi, Kenya',
    zoom: '12',
    center: '-1.2709,36.8169',
    twitterHandle: '@nairobicitygov',
  },
  lagos: {
    slug: 'lagos',
    latitude: '6.4552',
    longitude: '3.4198',
    name: 'Lagos',
    country: 'Nigeria',
    label: 'Lagos, Nigeria',
    zoom: '12',
    center: '6.4552,3.4198',
    twitterHandle: '@followlasg',
  },
  'dar-es-salaam': {
    slug: 'dar-es-salaam',
    latitude: '-6.7846',
    longitude: '39.2669',
    name: 'Dar es Salaam',
    country: 'Tanzania',
    label: 'Dar-es-salaam, Tanzania',
    zoom: '12',
    center: '-6.7846,39.2669',
    twitterHandle: '#DarEsSalaam',
  },
  africa: {
    slug: 'africa',
    latitude: '6.4552',
    longitude: '3.4198',
    name: 'Africa',
    country: 'Nigeria',
    label: 'Africa',
    zoom: '12',
    center: '6.4552,3.4198',
    twitterHandle: '@followlasg',
  },
};

const COUNTIES_LOCATION = {
  nairobi: {
    slug: 'nairobi',
    latitude: '-1.2709',
    longitude: '36.8169',
    name: 'Nairobi',
    label: 'Nairobi',
    country: 'kenya',
    zoom: '12',
    center: '-1.2709,36.8169',
  },
  kwale: {
    slug: 'kwale',
    latitude: '-4.05466',
    longitude: '39.66359',
    name: 'Kwale',
    label: 'Kwale',
    country: 'kenya',
    zoom: '12',
    center: '-4.05466,39.66359',
  },
  mombasa: {
    slug: 'mombasa',
    latitude: '-1.2709',
    longitude: '39.66359',
    name: 'Mombasa',
    label: 'Mombasa',
    country: 'kenya',
    zoom: '12',
    center: '-1.2709,39.66359',
  },
  kilifi: {
    slug: 'kilifi',
    latitude: '-3.63045',
    longitude: '39.84992',
    name: 'Kilifi',
    label: 'Kilifi',
    country: 'kenya',
    zoom: '12',
    center: '-3.63045,39.84992',
  },
  'tana-river': {
    slug: 'tana-river',
    latitude: '-1.48256',
    longitude: '40.03341',
    name: 'Tana River',
    label: 'Tana River',
    country: 'kenya',
    zoom: '12',
    center: '--1.48256,40.03341',
  },
  lamu: {
    slug: 'lamu',
    latitude: '-2.27169',
    longitude: '40.90201',
    name: 'Lamu',
    label: 'Lamu',
    country: 'kenya',
    zoom: '12',
    center: '-2.27169,40.90201',
  },
  'taita-taveta': {
    slug: 'taita-taveta',
    latitude: '-3.39605',
    longitude: '38.55609',
    name: 'Taita Taveta',
    label: 'Taita Taveta',
    country: 'kenya',
    zoom: '12',
    center: '-3.39605,38.55609',
  },
  garissa: {
    slug: 'garissa',
    latitude: '-0.45275',
    longitude: '39.64601',
    name: 'Garissa',
    label: 'Garissa',
    country: 'kenya',
    zoom: '12',
    center: '-0.45275,39.64601',
  },
  wajir: {
    slug: 'wajir',
    latitude: '1.7471',
    longitude: '40.05732',
    name: 'Wajir',
    label: 'Wajir',
    country: 'kenya',
    zoom: '12',
    center: '1.7471,40.05732',
  },
  mandera: {
    slug: 'mandera',
    latitude: '3.93726',
    longitude: '41.85688',
    name: 'Mandera',
    label: 'Mandera',
    country: 'kenya',
    zoom: '12',
    center: '3.93726,41.85688',
  },
  marsabit: {
    slug: 'marsabit',
    latitude: '2.33468',
    longitude: '37.99086',
    name: 'Marsabit',
    label: 'Marsabit',
    country: 'kenya',
    zoom: '12',
    center: '2.33468,37.99086',
  },
  isiolo: {
    slug: 'isiolo',
    latitude: '0.35462',
    longitude: '37.58218',
    name: 'Isiolo',
    label: 'Isiolo',
    country: 'kenya',
    zoom: '12',
    center: '0.35462,37.58218',
  },
  meru: {
    slug: 'meru',
    latitude: '0.04626',
    longitude: '37.65587',
    name: 'Meru',
    label: 'Meru',
    country: 'kenya',
    zoom: '12',
    center: '0.04626,37.65587',
  },
  'tharaka-nithi': {
    slug: 'tharaka-nithi',
    latitude: '-0.33316',
    longitude: '37.64587',
    name: 'Tharaka nithi',
    label: 'Tharaka nithi',
    country: 'kenya',
    zoom: '12',
    center: '-0.33316,37.64587',
  },
  embu: {
    slug: 'embu',
    latitude: '-0.53987',
    longitude: '37.45743',
    name: 'Embu',
    label: 'Embu',
    country: 'kenya',
    zoom: '12',
    center: '-0.53987,37.45743',
  },
  kitui: {
    slug: 'kitui',
    latitude: '-1.36696',
    longitude: '38.01055',
    name: 'Kitui',
    label: 'Kitui',
    country: 'kenya',
    zoom: '12',
    center: '-1.36696,38.01055',
  },
  machakos: {
    slug: 'machakos',
    latitude: '-1.52233',
    longitude: '37.26521',
    name: 'Machakos',
    label: 'Machakos',
    country: 'kenya',
    zoom: '12',
    center: '-1.52233,37.26521',
  },
  makueni: {
    slug: 'makueni',
    latitude: '-1.78079',
    longitude: '37.62882',
    name: 'Makueni',
    label: 'Makueni',
    country: 'kenya',
    zoom: '12',
    center: '-1.78079,37.62882',
  },
  nyandarua: {
    slug: 'nyandarua',
    latitude: '-0.27088',
    longitude: '36.37917',
    name: 'Nyandarua',
    label: 'Nyandarua',
    country: 'kenya',
    zoom: '12',
    center: '-0.27088,36.37917',
  },
  nyeri: {
    slug: 'nyeri',
    latitude: '-0.42013',
    longitude: '36.94759',
    name: 'Nyeri',
    label: 'Nyeri',
    country: 'kenya',
    zoom: '12',
    center: '-0.42013,36.94759',
  },
  kirinyaga: {
    slug: 'kirinyaga',
    latitude: '-0.49887',
    longitude: '37.28031',
    name: 'Kirinyaga',
    label: 'Kirinyaga',
    country: 'kenya',
    zoom: '12',
    center: '-0.49887,37.28031',
  },
  muranga: {
    slug: 'muranga',
    latitude: '-0.749997',
    longitude: '37.1166662',
    name: 'Muranga',
    label: 'Muranga',
    country: 'kenya',
    zoom: '12',
    center: '-0.749997,37.1166662',
  },
  kiambu: {
    slug: 'kiambu',
    latitude: '-1.17139',
    longitude: '36.83556',
    name: 'Kiambu',
    label: 'Kiambu',
    country: 'kenya',
    zoom: '12',
    center: '-1.17139,36.83556',
  },
  turkana: {
    slug: 'turkana',
    latitude: '3.11988',
    longitude: '35.59642',
    name: 'Turkana',
    label: 'Turkana',
    country: 'kenya',
    zoom: '9',
    center: '3.11988,35.59642',
  },
  'west-pokot': {
    slug: 'west-pokot',
    latitude: '1.23889',
    longitude: '35.11194',
    name: 'West Pokot',
    label: 'West Pokot',
    country: 'kenya',
    zoom: '9',
    center: '1.23889,35.11194',
  },
  samburu: {
    slug: 'samburu',
    latitude: '1.09667',
    longitude: '36.69806',
    name: 'Samburu',
    label: 'Samburu',
    country: 'kenya',
    zoom: '9',
    center: '1.09667,36.69806',
  },
  'trans-nzoia': {
    slug: 'trans-nzoia',
    latitude: '1.01572',
    longitude: '35.00622',
    name: 'Trans Nzoia',
    label: 'Trans Nzoia',
    country: 'kenya',
    zoom: '9',
    center: '1.01572,35.00622',
  },
  'uasin-gishu': {
    slug: 'uasin-gishu',
    latitude: '0.52036',
    longitude: '35.26993',
    name: 'Uasin Gishu',
    label: 'Uasin Gishu',
    country: 'kenya',
    zoom: '9',
    center: '0.52036,35.26993',
  },
  'elgeyo-marakwet': {
    slug: 'elgeyo-marakwet',
    latitude: '0.67028',
    longitude: '35.50806',
    name: 'Elgeyo-Marakwet',
    label: 'Elgeyo-Marakwet',
    country: 'kenya',
    zoom: '9',
    center: '0.67028,35.50806',
  },
  nandi: {
    slug: 'nandi',
    latitude: '0.20387',
    longitude: '35.105',
    name: 'Nandi',
    label: 'Nandi',
    country: 'kenya',
    zoom: '9',
    center: '0.20387,35.105',
  },
  baringo: {
    slug: 'baringo',
    latitude: '0.49194',
    longitude: '35.74303',
    name: 'Baringo',
    label: 'Baringo',
    country: 'kenya',
    zoom: '9',
    center: '0.49194,35.74303',
  },
  laikipia: {
    slug: 'laikipia',
    latitude: '0.2725',
    longitude: '36.53806',
    name: 'Laikipia',
    label: 'Laikipia',
    country: 'kenya',
    zoom: '9',
    center: '0.2725,36.53806',
  },
  nakuru: {
    slug: 'nakuru',
    latitude: '-0.30719',
    longitude: '36.07225',
    name: 'Nakuru',
    label: 'Nakuru',
    country: 'kenya',
    zoom: '9',
    center: '-0.30719,36.07225',
  },
  narok: {
    slug: 'narok',
    latitude: '-1.08083',
    longitude: '35.87111',
    name: 'Narok',
    label: 'Narok',
    country: 'kenya',
    zoom: '9',
    center: '-1.08083,35.87111',
  },
  kajiado: {
    slug: 'kajiado',
    latitude: '-1.85238',
    longitude: '36.77683',
    name: 'Kajiado',
    label: 'Kajiado',
    country: 'kenya',
    zoom: '9',
    center: '-1.85238,36.77683',
  },
  kericho: {
    slug: 'kericho',
    latitude: '-0.36774',
    longitude: '35.28314',
    name: 'Kericho',
    label: 'Kericho',
    country: 'kenya',
    zoom: '9',
    center: '-0.36774,35.28314',
  },
  bomet: {
    slug: 'bomet',
    latitude: '-0.785561',
    longitude: '35.339139',
    name: 'Bomet',
    label: 'Bomet',
    country: 'kenya',
    zoom: '9',
    center: '-0.785561,35.339139',
  },
  kakamega: {
    slug: 'kakamega',
    latitude: '0.28422',
    longitude: '34.75229',
    name: 'Kakamega',
    label: 'Kakamega',
    country: 'kenya',
    zoom: '9',
    center: '0.28422,34.75229',
  },
  vihiga: {
    slug: 'vihiga',
    latitude: '0.092104',
    longitude: '34.729877',
    name: 'Vihiga',
    label: 'Vihiga',
    country: 'kenya',
    zoom: '9',
    center: '0.092104,34.729877',
  },
  bungoma: {
    slug: 'bungoma',
    latitude: '0.5635',
    longitude: '34.56055',
    name: 'Bungoma',
    label: 'Bungoma',
    country: 'kenya',
    zoom: '9',
    center: '0.5635,34.56055',
  },
  busia: {
    slug: 'busia',
    latitude: '0.46005',
    longitude: '34.11169',
    name: 'Busia',
    label: 'Busia',
    country: 'kenya',
    zoom: '9',
    center: '0.46005,34.11169',
  },
  siaya: {
    slug: 'siaya',
    latitude: '0.0607',
    longitude: '34.28806',
    name: 'Siaya',
    label: 'Siaya',
    country: 'kenya',
    zoom: '9',
    center: '0.0607,34.28806',
  },
  kisumu: {
    slug: 'kisumu',
    latitude: '-0.10221',
    longitude: '34.76171',
    name: 'Kisumu',
    label: 'Kisumu',
    country: 'kenya',
    zoom: '9',
    center: '-0.10221,34.76171',
  },
  'homa-bay': {
    slug: 'homa-bay',
    latitude: '-0.52731',
    longitude: '34.45714',
    name: 'Homa Bay',
    label: 'Homa Bay',
    country: 'kenya',
    zoom: '9',
    center: '-0.52731,34.45714',
  },
  migori: {
    slug: 'migori',
    latitude: '-0.30719',
    longitude: '36.07225',
    name: 'Migori',
    label: 'Migori',
    country: 'kenya',
    zoom: '9',
    center: '-1.06343,34.47313',
  },
  kisii: {
    slug: 'kisii',
    latitude: '0.31354',
    longitude: '34.07146',
    name: 'Kisii',
    label: 'Kisii',
    country: 'kenya',
    zoom: '9',
    center: '0.31354,34.07146',
  },
  nyamira: {
    slug: 'nyamira',
    latitude: '-0.56333',
    longitude: '34.93583',
    name: 'Nyamira',
    label: 'Nyamira',
    country: 'kenya',
    zoom: '9',
    center: '-0.56333,34.93583',
  },
};

const headers = new Headers();

headers.append('Authorization', `token ${process.env.KE_HAP}`);

async function fetchAllNodes(url, options = { headers }, times = 0) {
  const response = await fetch(url, options);
  const resjson = await response.json();
  const data = resjson.results;

  if (resjson.next) {
    const nextData = await fetchAllNodes(resjson.next, options, times + 1);
    return { ...nextData, results: data.concat(nextData.results) };
  }

  return { ...resjson, results: data };
}

async function fetchGroupedBySensorType(url, options = { headers }, times = 0) {
  const response = await fetch(url, options);
  const resjson = await response.json();
  const data = resjson.results;
  const nairobiData = data.filter(
    (item) => item.location.city.toLowerCase() === 'nairobi'
  );
  function getAvg(sensor) {
    const total = sensor.reduce((acc, c) => acc + c, 0);
    return total / sensor.length;
  }
  function getAllSensorTypes(arr) {
    for (let i = 0; i < arr.length; i += 1) {
      if (arr[i] instanceof Array) {
        return getAllSensorTypes(arr[i]);
      }
      return Object.fromEntries(
        Object.entries(arr[i]).filter(([key]) => key === 'sensordatavalues')
      );
    }
    return null;
  }
  const sensorTypeData = nairobiData.map((value) => {
    const sensorDatas = getAllSensorTypes(
      value.sensors.map((item) => item.sensordatas)
    );
    const sensorsValues = Object.keys(sensorDatas).map(function (key) {
      return sensorDatas[key].map((item) => item);
    });
    const obj = {};
    sensorsValues.forEach((sensor) => {
      for (let i = 0; i < sensor.length; i += 1) {
        obj.sensor_type = sensor[i].value_type;
        obj.sensor_value = sensor[i].value;
      }
    });
    return obj;
  });
  function getSensorAverage(sensorType) {
    const P0 = sensorType
      .filter((item) => item.sensor_type === 'P0')
      .map((item) => Number(item.sensor_value));
    const P1 = sensorType
      .filter((item) => item.sensor_type === 'P1')
      .map((item) => Number(item.sensor_value));
    const P2 = sensorType
      .filter((item) => item.sensor_type === 'P2')
      .map((item) => Number(item.sensor_value));
    const temperature = sensorType
      .filter((item) => item.sensor_type === 'temperature')
      .map((item) => Number(item.sensor_value));
    const humidity = sensorType
      .filter((item) => item.sensor_type === 'humidity')
      .map((item) => Number(item.sensor_value));
    const noiseLeq = sensorType
      .filter((item) => item.sensor_type.replace(/_/g, '') === 'noiseLeq')
      .map((item) => Number(item.sensor_value));
    return {
      P0: Number.isNaN(getAvg(P0)) ? 0 : getAvg(P0),
      P1: Number.isNaN(getAvg(P1)) ? 0 : getAvg(P1),
      P2: Number.isNaN(getAvg(P2)) ? 0 : getAvg(P2),
      temperature: Number.isNaN(getAvg(temperature)) ? 0 : getAvg(temperature),
      humidity: Number.isNaN(getAvg(humidity)) ? 0 : getAvg(humidity),
      noiseLeq: Number.isNaN(getAvg(noiseLeq)) ? 0 : getAvg(noiseLeq),
    };
  }
  const sensorAverages = getSensorAverage(sensorTypeData);
  console.log(sensorAverages);
  if (resjson.next) {
    const nextData = await fetchGroupedBySensorType(
      resjson.next,
      options,
      times + 1
    );
    return {
      ...nextData,
      results: sensorAverages.concat(nextData.results),
    };
  }

  return { ...resjson, results: sensorAverages };
}

const API = {
  getAirData(city) {
    return fetch(`https://api.sensors.africa/v2/data/air/?city=${city}`);
  },
  getWeeklyP2Data(city) {
    const fromDate = new Date(Date.now() - 7 * 24 * 3600 * 1000)
      .toISOString()
      .substr(0, 10);
    return fetch(
      `https://api.sensors.africa/v2/data/air/?city=${city}&from=${fromDate}&interval=day&value_type=P2`
    );
  },
};
/**
 * Loads county citites map set in https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg
 * for Papa.parse to work in the node environment, we will have to pipe the stream returned,
 * The Papa.LocalChunkSize, Papa.RemoteChunkSize , download, withCredentials, worker, step, and complete config options are unavailable.
 * To register a callback with the stream to process data, use the data event like so: stream.on('data', callback) and to signal the end of stream, use the 'end' event like so: stream.on('end', callback).
 * src - https://github.com/mholt/PapaParse/blob/master/README.md#papa-parse-for-node
 * @returns {Promise} array of { County:String, Citie: String // Comma seperated}
 */
async function loadCountyCitiesMap() {
  return new Promise((resolve, reject) => {
    const options = {
      header: true,
      error(err) {
        reject(err);
      },
    };
    const dataStream = request.get(
      'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=0'
    );
    const parseStream = Papa.parse(Papa.NODE_STREAM_INPUT, options);
    dataStream.pipe(parseStream);
    const countyCityMap = [];
    parseStream.on('data', (chunk) => {
      countyCityMap.push(chunk);
    });

    parseStream.on('finish', () => {
      resolve(countyCityMap);
    });
  });
}

async function getCounty(city) {
  const countyCityMap = await loadCountyCitiesMap();
  const citiesInfo =
    countyCityMap &&
    countyCityMap.find((row) =>
      row.Cities.toLowerCase().trim().includes(city.toLowerCase().trim())
    );
  if (!citiesInfo) {
    return 'County Unavailable';
  }
  return citiesInfo.County;
}

export {
  CITIES_LOCATION,
  COUNTIES_LOCATION,
  getFormattedHumidityStats,
  getFormattedP2Stats,
  getFormattedTemperatureStats,
  getFormattedWeeklyP2Stats,
  fetchAllNodes,
  fetchGroupedBySensorType,
  getCounty,
};

export default API;
