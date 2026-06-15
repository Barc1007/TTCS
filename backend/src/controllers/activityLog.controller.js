import ActivityLog from '../models/ActivityLog.js';

export async function listActivityLogs(_req, res) {
  const logs = await ActivityLog.find().sort({ createdAt: -1 }).limit(100);
  res.json({ logs });
}
