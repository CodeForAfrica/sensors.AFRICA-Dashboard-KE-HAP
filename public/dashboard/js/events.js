const zoomMap = (value) => {
  const baseUrl = 'https://map.data4sdgs.sensors.africa#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  document.getElementById('map-iframe').src = newUrl;
};
