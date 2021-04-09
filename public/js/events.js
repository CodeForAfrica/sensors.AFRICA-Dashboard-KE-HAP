const zoomMap = (value) => {
  const baseUrl = '/map/index.html/#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  const countyName = countiesLocation[value].name;

  document.getElementById('map-iframe').src = newUrl;
  document.getElementById('county-name').innerHTML = countyName;
};
