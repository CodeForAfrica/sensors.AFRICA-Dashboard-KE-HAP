// NOTE: requires('db');

async function loadNodes() {
  let nodes = window.db.getItem('nodes');
  if (!nodes) {
    const results = await fetch('/api/nodes/?days=7');
    const data = await results.json();
    nodes = data.results;
    window.db.setItem('nodes', nodes);
  }
  return nodes;
}

async function load() {
  await loadNodes();
}

async function getNodes() {
  return loadNodes();
}

window.aq = {
  load,
  getNodes,
  charts: {},
};
