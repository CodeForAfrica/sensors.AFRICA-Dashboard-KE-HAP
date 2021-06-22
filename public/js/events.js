const handleLocationChange = async (value) => {
  const baseUrl = '/map/index.html/#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  const county = countiesLocation[value].name;
  countyGraph.changeCounty(county);
  const numberOfHouseholds = await getHouseHoldCounty(county);

  document.getElementById('map-iframe').src = newUrl;
  document.getElementById('county-name').innerHTML = county;
  document.getElementById('county-households').innerHTML = numberOfHouseholds;
};
