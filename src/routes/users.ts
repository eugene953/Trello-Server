
import { Router, Request, Response } from 'express';
import { createUser, loginUser } from '../models';

const router = Router();

router.post('/register', async (req: Request, res: Response) => {
      console.log("Incoming body:", req.body);
  const { fullName, email, password } = req.body;

  if ( !fullName || !email || !password) {
    return res.status(400).json({ message: 'Missing fields' });
  }

  try {
    const {user, token} = await createUser(fullName, email, password);
    res.status(201).json({ 
        message: 'User created successfully',
        user: { id: user.id, fullName: user.fullName, email: user.email },
        token,
     });
  } catch (error) {
    console.error('Error inserting user:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req: Request, res: Response) => {
  console.log('Login request:', req.body);
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    const { user, token } = await loginUser(email, password);

    res.json({
      message: 'Login successful',
      user: { id: user.id, fullName: user.fullName, email: user.email },
      token,
    });
  } catch (error) {
    console.error('Login error:', error);
     if (error instanceof Error) {
      res.status(401).json({ message: error.message });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }
});

export default router;
