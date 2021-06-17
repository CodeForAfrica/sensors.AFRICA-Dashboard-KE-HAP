import { fetchAllNodes } from 'api';

export default async function handler(req, res) {
  try {
    const data = await fetchAllNodes('https://api.sensors.africa/v1/node');
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
