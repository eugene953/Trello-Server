import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import pool from './database';
import users from './routes/users';
import tasks from './routes/tasks';
import list from './routes/list';
import card from './routes/card';
import { swaggerUiHandler, swaggerDocHandler } from './swagger/swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())

// Register routes
app.use('/api', users);
app.use('/api', tasks);
app.use('/api', list);
app.use('/api', card);

app.use('/api-docs', swaggerUiHandler, swaggerDocHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
