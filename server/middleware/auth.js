import jwt from 'jsonwebtoken'

export const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  console.log('Token:', token);  // Log the token to check it's correct

  if (!token) {
    return res.status(401).json({ msg: 'Authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded Token:', decoded);  // Log the decoded token if verification succeeds
    req.user = decoded;  // Attach decoded user to the request object
    next();
  } catch (err) {
    console.error('Token Verification Error:', err);  // Log the error for more insights
    return res.status(401).json({ msg: 'Token is not valid', error: err.message });
  }
};
