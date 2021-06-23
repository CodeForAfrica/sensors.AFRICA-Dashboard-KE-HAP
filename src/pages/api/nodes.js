import { fetchAllNodes } from 'api';

export default async function handler(req, res) {
  const daysAgo = req.query.days || 7;
  const date = new Date();
  const fromDate = date.setDate(date.getDate() - daysAgo);
  const lastNotify = new Date(fromDate).toISOString();
  try {
    const data = await fetchAllNodes(
      `https://api.sensors.africa/v1/node?last_notify__gte=${lastNotify}`
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
