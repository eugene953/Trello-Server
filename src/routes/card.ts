import express, { Request, Response } from 'express';
import { createCard, deleteCard, updateCard } from '../models';
import Auth from '../auth';
import { asyncHandler } from '../utils/asynHandler';

const router = express.Router();

router.post('/createCard',
     Auth,
  asyncHandler (async (req: Request, res: Response) => {
  const { title, columnId } = req.body;
  try {
    const card = await createCard(title, columnId);
    res.status(201).json(card);
  } catch {
    res.status(500).json({ error: 'Failed to create card' });
  }
}));


router.put('/updatecard/:id', 
    Auth,
  asyncHandler (async (req: Request, res: Response) => {

  const { title } = req.body;
  try {
    const card = await updateCard(+req.params.id, title);
    res.json(card);
  } catch {
    res.status(500).json({ error: 'Failed to update card' });
  }
}));

router.delete('/deleteCard/:id', 
    Auth,
  asyncHandler (async (req: Request, res: Response) => {
  try {
    await deleteCard(+req.params.id);
    res.json({ message: 'Card deleted' });
  } catch {
    res.status(500).json({ error: 'Failed to delete card' });
  }
}));

export default router;
