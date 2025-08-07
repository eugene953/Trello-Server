import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv'
import users from './routes/users';
import projects from './routes/project';
import task from './routes/task';
import { swaggerUiHandler, swaggerDocHandler } from './swagger';

dotenv.config();

const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(cors())

app.use('/api', users);
app.use('/api', projects);
app.use('/api', task);


app.use('/api-docs', swaggerUiHandler, swaggerDocHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Swagger docs at http://localhost:${PORT}/api-docs`);
});
