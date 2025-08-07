import express, { Request, Response } from 'express';
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from '../models';
import { asyncHandler } from '../utils/asynHandler';
import Auth from '../auth';

const router = express.Router();
/**
 * @swagger
 * /api/createTask:
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
 *             required:
 *               - title
 *               - status
 *               - projectId
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Build API"
 *               description:
 *                 type: string
 *                 example: "Build the backend API for task manager"
 *               status:
 *                 type: string
 *                 example: "pending"
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *                 example: "2025-08-30T15:00:00.000Z"
 *               projectId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Task created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Missing required fields
 *       500:
 *         description: Server error
 */

router.post(
  '/createTask',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const { title, description = null, status, dueDate = null, projectId } = req.body;

      if (!title || !status || !projectId) {
        return res.status(400).json({ error: 'Title, status and projectId are required' });
      }

      const dueDateObj = dueDate ? new Date(dueDate) : null;

      const task = await createTask(title, description, status, dueDateObj, projectId);
      res.status(201).json(task);
    } catch (error) {
       console.error('Error creaeting task:', error);
      res.status(500).json({ error: 'Failed to create task' });
    }
  })
);

/**
 * @swagger
 * /api/getAllTask:
 *   get:
 *     summary: Retrieve all tasks
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of tasks
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Server error
 */

router.get(
  '/getAllTask',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const tasks = await getAllTasks();
      res.json(tasks);
    } catch (error) {
      console.error('Error getting tasks:', error);
      res.status(500).json({ error: 'Failed to get tasks' });
    }
  })
);

/**
 * @swagger
 * /api/getTaskById/{id}:
 *   get:
 *     summary: Get a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Task not found
 *       500:
 *         description: Server error
 */

router.get(
  '/getTaskById/:id',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const task = await getTaskById(+req.params.id);
      if (!task) return res.status(404).json({ error: 'Not found' });
      res.json(task);
    } catch {
      res.status(500).json({ error: 'Failed to get task' });
    }
  })
);


/**
 * @swagger
 * /api/updateTask/{id}:
 *   put:
 *     summary: Update a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
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
 *               status:
 *                 type: string
 *               dueDate:
 *                 type: string
 *                 format: date-time
 *               projectId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Task updated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       500:
 *         description: Server error
 */

router.put(
  '/updateTask/:id',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      const updateData = { ...req.body };
      if (updateData.dueDate) {
        updateData.dueDate = new Date(updateData.dueDate);
      }
      const task = await updateTask(+req.params.id, updateData);
      res.json(task);
    } catch {
      res.status(500).json({ error: 'Failed to update task' });
    }
  })
);


/**
 * @swagger
 * /api/deleteTask/{id}:
 *   delete:
 *     summary: Delete a task by ID
 *     tags: [Task]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Task ID
 *     responses:
 *       200:
 *         description: Task deleted successfully
 *       500:
 *         description: Server error
 */

router.delete(
  '/deleteTask/:id',
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    try {
      await deleteTask(+req.params.id);
      res.json({ message: 'Task deleted' });
    } catch {
      res.status(500).json({ error: 'Failed to delete task' });
    }
  })
);

export default router;
