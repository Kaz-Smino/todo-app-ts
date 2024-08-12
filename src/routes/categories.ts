import express, { Request, Response } from 'express';
import { Category } from '../models'; // カテゴリモデルをインポート
import auth from '../middleware/auth'; // 認証ミドルウェアをインポート

const router = express.Router();

// カテゴリの一覧を取得
router.get('/', auth, async (req: Request, res: Response) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
});

// 新しいカテゴリを作成
router.post('/', auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const category = new Category({ name });
    await category.save();
    res.status(201).json(category);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// カテゴリを更新
router.put('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const category = await Category.findByIdAndUpdate(id, { name }, { new: true });
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

// カテゴリを削除
router.delete('/:id', auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await Category.findByIdAndDelete(id);
    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }
    res.json({ message: 'Category deleted' });
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
});

export default router;