import { fetchAllNodes } from 'api';

export default async function handler(req, res) {
  const daysAgo = req.query.days || 0;
  const date = new Date();
  const dateRange = date.setDate(date.getDate() - daysAgo);
  let dateString;

  if (dateRange) {
    dateString = new Date(dateRange).toISOString();
  }

  try {
    const data = await fetchAllNodes(
      `https://api.sensors.africa/v1/node?last_notify__gte=${dateString}`
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
