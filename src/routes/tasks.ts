import { Router, Request, Response } from 'express';
import { createTask, getAllTasks, getTaskById, updateTask , deleteTask} from '../models';
import { asyncHandler } from '../utils/asynHandler';
import Auth from '../auth';

const router = Router(); 

router.post('/createTask',
  Auth,
  asyncHandler (async (req: Request, res: Response) => {
  const { title, description, dueDate } = req.body;

  if (!title){
      return res.status(400).json({ message: 'Title is required' });
  }

  const userId = parseInt(req.user!.id, 10)
  const dueDateObj = dueDate ? new Date(dueDate) : undefined;
  const task = await createTask(userId, title, description, dueDateObj);
   res.status(201).json({ message: 'Task created', task });
})
);

router.get('/getAllTask',
  Auth,
  asyncHandler (async (req: Request, res: Response) => {
    
  const userId = parseInt(req.user!.id, 10)
  const task = await getAllTasks(userId);
  res.status(201).json({ message: 'Gotten all tasks successfully', task });
})
);

router.get('/getTaskById/:id',
  Auth,
  asyncHandler (async (req: Request, res: Response) => {
     if (!req.user) return res.status(401).json({ message: "Unauthorized" });

    console.log("User ID:", req.user!.id);
    console.log("Task ID param:", req.params.id);

  const userId = parseInt(req.user!.id, 10)
  const taskId = parseInt(req.params.id, 10);

if (isNaN(taskId)) {
  return res.status(400).json({ message: "Invalid task ID" });
}
  const task = await getTaskById(Number(req.params.id), userId);
  task ? res.json(task) : res.status(404).json({ message: 'Task not found' });
})
);

router.put('/updateTask/:id',
Auth,
asyncHandler (async (req: Request, res: Response) => {
   if (!req.user) return res.status(401).json({ message: "Unauthorized" });

  const userId = parseInt(req.user!.id, 10)
  const task = await updateTask(Number(req.params.id), userId, req.body);
  if (task.count > 0) {
  res.json({ message: "Task updated successfully" });
} else {
  res.status(404).json({ message: "Task not found or not updated" });
}

})
);

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