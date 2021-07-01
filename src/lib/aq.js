import fs from 'fs';
import path from 'path';

const CACHE_FILENAME = 'nodes.json';

const headers = new Headers();
headers.append('Authorization', `token ${process.env.KE_HAP}`);

async function fetchAllNodes(url, options = { headers }, times = 0) {
  const response = await fetch(url, options);
  const resjson = await response.json();
  const data = resjson.results;
  if (resjson.next) {
    const nextData = await fetchAllNodes(resjson.next, options, times + 1);
    return { ...nextData, results: data.concat(nextData.results) };
  }

  return { ...resjson, results: data };
}

async function fetchNodes(days = 7) {
  const toDate = new Date();
  const fromDate = toDate.setDate(toDate.getDate() - days);
  const lastNotify = new Date(fromDate).toISOString();

  return fetchAllNodes(
    `https://api.sensors.africa/v1/node?last_notify__gte=${lastNotify}`
  );
}

export async function loadNodes() {
  const nodes = await fetchNodes();
  const publicDirectory = path.join(process.cwd(), 'public/json');
  const filePath = path.join(publicDirectory, CACHE_FILENAME);
  fs.writeFileSync(filePath, JSON.stringify(nodes), 'utf8');
  return nodes;
}

export async function getNodes() {
  let cachedNodes;
  try {
    const publicDirectory = path.join(process.cwd(), 'public/json');
    const filePath = path.join(publicDirectory, CACHE_FILENAME);
    cachedNodes = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  } catch (error) {
    cachedNodes = null;
  }

  return cachedNodes;
}
