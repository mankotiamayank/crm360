import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  // This creates a secure token valid for 30 days
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

export default generateToken;