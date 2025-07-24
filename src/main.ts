import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import pool from './database';
import users from './routes/users';
import tasks from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Express + TypeScript!');
});

// Register routes
app.use('/api', users);
app.use('/api', tasks);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
