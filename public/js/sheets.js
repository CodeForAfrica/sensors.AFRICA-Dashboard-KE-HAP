async function loadSheets() {
  //county-cities
  Papa.parse(
    'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=0',
    {
      download: true,
      header: true,
      complete: function (results) {
        var countyCityMap = results.data;
        setLocalItem('countyCityMap', countyCityMap);
      },
    }
  );

  //household-information
  Papa.parse(
    'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=679979845',
    {
      download: true,
      header: true,
      complete: function (results) {
        var countyHouseholdMap = results.data;
        setLocalItem('countyHouseholdMap', countyHouseholdMap);
      },
    }
  );
}

async function init() {
  if (!getLocalItem('countyHouseholdMap') || !getLocalItem('countyCityMap')) {
    loadSheets();
  }
}

function getLocalItem(key) {
  const localItem =  JSON.parse(localStorage.getItem(key));
  if(!localItem || !localItem.expiry || Date.now>localItem.expiry){
      return null
  }
  return localItem.data;
}

function setLocalItem(key, item) {
  return localStorage.setItem(
    key,
    JSON.stringify({ data: item, expiry: Date.now() + 3 * 60 * 100 })//expiry = 3 mins
  ); 
}

async function gethouseHold(county) {
  let countyHouseholdMap = getLocalItem('countyHouseholdMap');
  if (!countyHouseholdMap) {
    await loadSheets();
    countyHouseholdMap = getLocalItem('countyHouseholdMap');
  }
  if (!countyHouseholdMap) {
    return 0;
  }
  const householdInfo = countyHouseholdMap.find(
    (row) => row.County.toLowerCase() === county.toLowerCase()
  );
  if (!householdInfo) {
    return 0;
  }
  return Number(householdInfo.Households);
}

async function getCounty(city) {
  let countyCityMap = getLocalItem('countyCityMap');
  if (!countyCityMap) {
    await loadSheets();
    countyCityMap = getLocalItem('countyCityMap');
  }
  if (!countyCityMap) {
    return 'County Unavailable';
  }
  const citiesInfo = countyCityMap.find((row) =>
    row.Cities.toLowerCase().include(city.toLowerCase())
  );
  if (!citiesInfo) {
    return 'County Unavailable';
  }
  return citiesInfo.County;
}

window.addEventListener('DOMContentLoaded', init);
