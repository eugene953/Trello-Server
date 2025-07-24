import jwt from 'jsonwebtoken';

const generateToken = (user: { id: number; role: 'user' }) => {
  return jwt.sign(
    { id: user.id, role: user.role },
      process.env.JWT_SECRET || 'zDJzXV5W5mR0Ysz2uJNhfoWvEutpZwVnPt2bG1ipnEU=',
    { expiresIn: '1h' }
  );
};

export { generateToken };
