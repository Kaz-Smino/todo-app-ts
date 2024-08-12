import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User, Task, Category, TaskCategory } from './models';

dotenv.config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI as string);
    console.log('Connected to MongoDB');

    // 既存のデータを削除
    await User.deleteMany({});
    await Task.deleteMany({});
    await Category.deleteMany({});
    await TaskCategory.deleteMany({});

    // ユーザーの作成
    const user = new User({
      email: 'test@example.com',
      password: 'password123', // 実際にはハッシュ化する必要があります
    });
    await user.save();

    // カテゴリーの作成
    const category1 = new Category({ name: 'Work' });
    const category2 = new Category({ name: 'Personal' });
    await category1.save();
    await category2.save();

    // タスクの作成
    const task1 = new Task({
      user_id: user._id,
      task: 'Complete the project',
      is_completed: false,
    });
    const task2 = new Task({
      user_id: user._id,
      task: 'Buy groceries',
      is_completed: false,
    });
    await task1.save();
    await task2.save();

    // タスクカテゴリーの関連付け
    const taskCategory1 = new TaskCategory({
      task_id: task1._id,
      category_id: category1._id,
    });
    const taskCategory2 = new TaskCategory({
      task_id: task2._id,
      category_id: category2._id,
    });
    await taskCategory1.save();
    await taskCategory2.save();

    console.log('Database seeded successfully');
    process.exit();
  } catch (error) {
    console.error('Error seeding database', error);
    process.exit(1);
  }
};

seedDatabase();