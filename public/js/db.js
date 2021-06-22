function getLocalItem(key) {
  const localItem = JSON.parse(localStorage.getItem(key));
  if (!localItem || !localItem.expiry || Date.now() > localItem.expiry) {
    return null;
  }
  return localItem.data;
}

function setLocalItem(key, item) {
  return localStorage.setItem(
    key,
    JSON.stringify({ data: item, expiry: Date.now() + 3 * 60 * 100 }) // expiry = 3 mins
  );
}

window.db = {
  setItem: setLocalItem,
  getItem: getLocalItem,
};
