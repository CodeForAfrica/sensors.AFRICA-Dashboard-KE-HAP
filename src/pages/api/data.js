import { fetchGroupedBySensorType } from 'api';

export default async function handler(req, res) {
  try {
    const data = await fetchGroupedBySensorType(
      'https://api.sensors.africa/v1/node?last_notify__gte=2021-06-13T10:00'
    );
    return res.status(200).json(data);
  } catch (err) {
    return res.status(500).json(err);
  }
}
