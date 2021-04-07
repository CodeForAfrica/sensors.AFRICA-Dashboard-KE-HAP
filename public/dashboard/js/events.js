const sendEvent = (value) => {
  let domain = 'http://localhost:3000/dashboard/index.html';

  let iframe = document.getElementById('map-iframe').contentWindow;
  let data = value;
  iframe.postMessage(data, domain);
};
