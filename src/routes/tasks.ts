import express, { Request, Response } from 'express';
import { Task, TaskCategory } from '../models';
import auth from '../middleware/auth'; // デフォルトエクスポートをインポート

const router = express.Router();

interface AuthRequest extends Request {
  userId?: string;
}

// Get all tasks for the authenticated user
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ userId: req.userId })
      .populate('categories', 'name');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// Create a new task
router.post('/', auth, async (req: AuthRequest, res: Response) => {
  const { task, categories } = req.body;
  const newTask = new Task({
    userId: req.userId,
    task
  });

  try {
    const savedTask = await newTask.save();

    if (categories && Array.isArray(categories)) {
      const taskCategories = categories.map((categoryId: string) => ({
        taskId: savedTask._id,
        categoryId
      }));
      await TaskCategory.insertMany(taskCategories);
    }

    const populatedTask = await Task.findById(savedTask._id).populate('categories', 'name');
    res.status(201).json(populatedTask);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Update a task
router.put('/:id', auth, async (req: AuthRequest, res: Response) => {
  const { task, isCompleted, categories } = req.body;

  try {
    const updatedTask = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { task, isCompleted, updatedAt: new Date() },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    // Update task categories
    if (categories && Array.isArray(categories)) {
      await TaskCategory.deleteMany({ taskId: updatedTask._id });
      const taskCategories = categories.map((categoryId: string) => ({
        taskId: updatedTask._id,
        categoryId
      }));
      await TaskCategory.insertMany(taskCategories);
    }

    const populatedTask = await Task.findById(updatedTask._id).populate('categories', 'name');
    res.json(populatedTask);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// Delete a task
router.delete('/:id', auth, async (req: AuthRequest, res: Response) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await TaskCategory.deleteMany({ taskId: task._id });
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

export default router;