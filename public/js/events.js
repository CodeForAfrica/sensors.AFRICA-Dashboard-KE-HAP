const handleLocationChange = async (value) => {
  const baseUrl = '/map/index.html/#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  const county = countiesLocation[value].name;
  const numberOfHouseholds =await gethouseHold(county);

  document.getElementById('map-iframe').src = newUrl;
  document.getElementById('county-name').innerHTML = county;
  document.getElementById('county-households').innerHTML = numberOfHouseholds;
};
