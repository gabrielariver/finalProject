export function requireClient(req, res, next) {
  const clientId = req.header('X-Client-Id');
  if (!clientId) return res.status(400).json({ error: 'missing X-Client-Id' });
  req.clientId = clientId;
  next();
}
