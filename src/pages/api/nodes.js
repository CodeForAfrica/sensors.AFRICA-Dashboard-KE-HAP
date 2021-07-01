import { getNodes } from 'lib/aq';

export default async function handler(req, res) {
  const data = await getNodes();
  if (data) {
    return res.status(200).json(data);
  }
  return res.status(500).json();
}
