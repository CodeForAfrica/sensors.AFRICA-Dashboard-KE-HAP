// NOTE: requires('db');

async function loadCountySlugMap() {
  return new Promise((resolve, reject) => {
    window.Papa.parse(
      'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=1323302673',
      {
        download: true,
        header: true,
        complete(results) {
          const countySlugMap = {};
          if (results.data.length) {
            const reducer = (acc, { name, value }) => {
              acc[name.trim()] = value.trim();
              return acc;
            };
            results.data.reduce(reducer, countySlugMap);
          }
          window.db.setItem('countySlugMap', countySlugMap);
          resolve(countySlugMap);
        },
        error(err) {
          reject(err);
        },
      }
    );
  });
}

async function loadCountyCitiesMap() {
  return new Promise((resolve, reject) => {
    window.Papa.parse(
      'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=0',
      {
        download: true,
        header: true,
        complete(results) {
          const countyCitiesMap = {};
          const cityCountyMap = {};
          if (results.data.length) {
            const countyReducer = (acc, { name, value }) => {
              acc[name.trim()] = value
                .trim()
                .split(',')
                .map((city) => city.trim())
                .filter((city) => city.length);
              return acc;
            };
            results.data.reduce(countyReducer, countyCitiesMap);
            const cityReducer = (acc, { name, value }) => {
              const cities = value.trim().split(',');
              cities.forEach((city) => {
                const cityName = city.trim();
                if (cityName) {
                  acc[cityName] = name.trim();
                }
              });
              return acc;
            };
            results.data.reduce(cityReducer, cityCountyMap);
          }
          window.db.setItem('countyCitiesMap', countyCitiesMap);
          window.db.setItem('cityCountyMap', cityCountyMap);
          resolve(cityCountyMap);
        },
        error(err) {
          reject(err);
        },
      }
    );
  });
}

async function loadCountyHouseholdsMap() {
  return new Promise((resolve, reject) => {
    window.Papa.parse(
      'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=679979845',
      {
        download: true,
        header: true,
        complete(results) {
          const countyHouseholdsMap = {};
          if (results.data.length) {
            const reducer = (acc, { name, value }) => {
              acc[name.trim()] = Number(value);
              return acc;
            };
            results.data.reduce(reducer, countyHouseholdsMap);
          }
          window.db.setItem('countyHouseholdsMap', countyHouseholdsMap);
          resolve(countyHouseholdsMap);
        },
        error(err) {
          reject(err);
        },
      }
    );
  });
}

async function load() {
  if (!window.db.getItem('countySlugMap')) {
    loadCountySlugMap();
  }
  if (!window.db.getItem('countyCitiesMap')) {
    loadCountyCitiesMap();
  }
  if (!window.db.getItem('countyHouseholdsMap')) {
    loadCountyHouseholdsMap();
  }
}

async function getHouseholdsMap() {
  let map = window.db.getItem('countyHouseholdsMap');
  if (!map) {
    map = await loadCountyHouseholdsMap();
  }
  return map;
}

async function getHouseholds(county) {
  const countyHouseholdsMap = await getHouseholdsMap();
  const name = county ? county.trim() : undefined;
  const households = name ? countyHouseholdsMap[name] : undefined;
  if (!households) {
    return 0;
  }
  return households;
}

async function getCityCountyMap() {
  let map = window.db.getItem('cityCountMap');
  if (!map) {
    map = await loadCountyCitiesMap();
  }
  return map;
}

async function getCounty(city) {
  const cityCountyMap = await getCityCountyMap();
  const name = city ? city.trim() : undefined;
  return name ? cityCountyMap[name] : undefined;
}

async function getCountyCitiesMap() {
  let map = window.db.getItem('countyCitiesMap');
  if (!map) {
    await loadCountyCitiesMap();
    map = window.db.getItem('countyCitiesMap');
  }
  return map;
}

async function getCities(county) {
  const countyCitiesMap = await getCountyCitiesMap();
  const name = county ? county.trim() : undefined;
  return name ? countyCitiesMap[name] : [];
}

window.sheets = {
  load,
  getHouseholdsMap,
  getHouseholds,
  getCityCountyMap,
  getCounty,
  getCountyCitiesMap,
  getCities,
};
