import express, { Request, Response } from 'express';
import { createColumn, deleteColumn, getAllColumns, getColumnById } from '../models';
import { asyncHandler } from '../utils/asynHandler';
import Auth from '../auth';

const router = express.Router();

router.post('/createColumn', 
     Auth,
  asyncHandler (async (req: Request, res: Response) => {

  try {
    const column = await createColumn(req.body.title);
    res.status(201).json(column);
  } catch {
    res.status(500).json({ error: 'Failed to create column' });
  }
}));

router.get('/getAllColumn',
   Auth,
  asyncHandler (async (req: Request, res: Response) => {
    try {
        const columns = await getAllColumns();
        res.json(columns);
    }catch (error) {
        console.error('Error getting columns:', error);
        res.status(500).json({error: 'Failed to get columns'});
    }
}));

router.get('/getColumnById/:id', 
    Auth,
  asyncHandler (async (req: Request, res: Response) => {
  try {
    const column = await getColumnById(+req.params.id);
    if (!column) return res.status(404).json({ error: 'Not found' });
    res.json(column);
  } catch {
    res.status(500).json({ error: 'Failed to get column' });
  }
}));

  router.delete('/deleteColumn/:id', 
     Auth,
  asyncHandler (async (req: Request, res: Response) => {
  try {
    await deleteColumn(+req.params.id);
    res.json({ message: 'Column deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete column' });
  }
}));

export default router;