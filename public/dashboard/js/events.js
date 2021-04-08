// Uses window postmessage to communicate with the iframe - not used at the moment
const sendEvent = (value) => {
  let domain = 'http://localhost:3000/dashboard/index.html';

  let iframe = document.getElementById('map-iframe').contentWindow;
  let data = value;
  iframe.postMessage(data, domain);
};

const zoomMap = (value) => {
  const baseUrl = 'http://localhost:3000/map/index.html#';
  const newUrl = `${baseUrl}${countiesLocation[value].zoom}/${countiesLocation[value].latitude}/${countiesLocation[value].longitude}`;

  document.getElementById('map-iframe').src = newUrl;
};
