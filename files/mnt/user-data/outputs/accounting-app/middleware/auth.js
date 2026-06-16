module.exports = function requireAuth(req, res, next) {
  if (req.session && req.session.userId) {
    return next();
  }
  // Return 401 and redirect signal for SPA
  return res.status(401).json({ error: 'Unauthorized', redirect: '/login.html' });
};
