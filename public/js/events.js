const zoomMap = (value) => {
  console.log(countiesLocation,value)
  const baseUrl = '/map/index.html/#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  document.getElementById('map-iframe').src = newUrl;
};
