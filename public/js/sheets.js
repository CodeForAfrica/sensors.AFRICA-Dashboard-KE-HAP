async function loadCountyHouseholdMap(){
  return new Promise((resolve, reject) => {
    Papa.parse(
      'https://docs.google.com/spreadsheets/d/1jNk90L1FGXt3estVzFII2-eeKQZ85RYiLKCyNe14nGg/export?format=csv&gid=679979845',
      {
        download: true,
        header: true,
        complete: function (results) {
          const countyHouseholdMap = results.data;
          setLocalItem('countyHouseholdMap', countyHouseholdMap);
          resolve(countyHouseholdMap)
        },
        error (err) {
          reject(err)
        }
      }
    );
  })
}

async function init() {
  if (!getLocalItem('countyHouseholdMap')) {
    loadCountyHouseholdMap();
  }
}

function getLocalItem(key) {
  const localItem =  JSON.parse(localStorage.getItem(key));
  if(!localItem || !localItem.expiry || Date.now() > localItem.expiry){
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

async function getHouseHoldCount(county) {
  let countyHouseholdMap = getLocalItem('countyHouseholdMap');
  if (!countyHouseholdMap) {
    await loadCountyHouseholdMap();
    countyHouseholdMap = getLocalItem('countyHouseholdMap');
  }
  const householdInfo = countyHouseholdMap && countyHouseholdMap.find(
    (row) => row.County.toLowerCase().trim() === county.toLowerCase().trim()
  );
  if (!householdInfo) {
    return 0;
  }
  return Number(householdInfo.Households);
}



window.addEventListener('DOMContentLoaded', init);
