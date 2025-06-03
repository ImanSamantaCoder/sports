import jwt from 'jsonwebtoken';

const verifyToken = (req, res, next) => {
  console.log('Token verification middleware triggered');

  const token = req.cookies.token;
  console.log('Received token from cookie:', token);

  if (!token) {
    console.log('No token found in cookies.');
    return res.status(401).json({ msg: 'Authorization denied - no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token payload:', decoded);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('JWT verification failed:', err.message);
    return res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  } else {
    return res.status(403).json({ msg: 'Access denied - admin only' });
  }
};

// Named export
export { verifyToken, verifyAdmin };
