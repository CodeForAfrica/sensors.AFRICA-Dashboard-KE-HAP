const getAnalytics = () => {
  const nodes = window.db.getItem('nodes');
  console.log('TESTING ANALYTICS', nodes);
};

window.analytics = {
  getAnalytics,
};
