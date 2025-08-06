
import { Router, Request, Response } from 'express';
import {
  createTask,
  getAllTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../models';
import { asyncHandler } from '../utils/asynHandler';
import Auth from '../auth';

const router = Router();

/**
 * @swagger
 * /createTask:
 *   post:
 *     summary: Create a new task
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       201:
 *         description: Task created
 *       400:
 *         description: Title is required
 */
router.post('/createTask',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    const { title, description, dueDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const userId = parseInt(req.user!.id, 10);
    const dueDateObj = dueDate ? new Date(dueDate) : undefined;

    const task = await createTask(userId, title, description, dueDateObj);
    res.status(201).json({ message: 'Task created', task });
  })
);

/**
 * @swagger
 * /getAllTask:
 *   get:
 *     summary: Get all tasks for the logged-in user
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all tasks
 */
router.get('/getAllTask',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.user!.id, 10);
    const task = await getAllTasks(userId);
    res.status(200).json({ message: 'Gotten all tasks successfully', task });
  })
);

/**
 * @swagger
 * /getTaskById/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task found
 *       400:
 *         description: Invalid task ID
 *       404:
 *         description: Task not found
 */
router.get('/getTaskById/:id',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = parseInt(req.user!.id, 10);
    const taskId = parseInt(req.params.id, 10);

    if (isNaN(taskId)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    const task = await getTaskById(taskId, userId);
    task
      ? res.json(task)
      : res.status(404).json({ message: 'Task not found' });
  })
);

/**
 * @swagger
 * /updateTask/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Task updated
 *       404:
 *         description: Task not found
 */
router.put('/updateTask/:id',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    const userId = parseInt(req.user!.id, 10);
    const task = await updateTask(Number(req.params.id), userId, req.body);

    if (task.count > 0) {
      res.json({ message: "Task updated successfully" });
    } else {
      res.status(404).json({ message: "Task not found or not updated" });
    }
  })
);

/**
 * @swagger
 * /deleteTask/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       404:
 *         description: Task not found or not authorized
 */
router.delete('/deleteTask/:id',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    const userId = parseInt(req.user!.id, 10);
    const result = await deleteTask(Number(req.params.id), userId);

    result.count > 0
      ? res.json({ message: 'Task deleted successfully' })
      : res.status(404).json({ message: 'Task not found or not authorized' });
  })
);

export default router;
