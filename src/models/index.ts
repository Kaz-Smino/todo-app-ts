import mongoose, { Document, Schema } from 'mongoose';

interface IUser extends Document {
  email: string;
  password: string;
  created_at: Date;
  updated_at: Date;
}

interface ITask extends Document {
  user_id: mongoose.Types.ObjectId;
  task: string;
  is_completed: boolean;
  created_at: Date;
  updated_at: Date;
}

interface ICategory extends Document {
  name: string;
}

interface ITaskCategory extends Document {
  task_id: mongoose.Types.ObjectId;
  category_id: mongoose.Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const taskSchema = new Schema<ITask>({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  task: { type: String, required: true },
  is_completed: { type: Boolean, default: false },
  created_at: { type: Date, default: Date.now },
  updated_at: { type: Date, default: Date.now }
});

const categorySchema = new Schema<ICategory>({
  name: { type: String, required: true }
});

const taskCategorySchema = new Schema<ITaskCategory>({
  task_id: { type: Schema.Types.ObjectId, ref: 'Task', required: true },
  category_id: { type: Schema.Types.ObjectId, ref: 'Category', required: true }
});

export const User = mongoose.model<IUser>('User', userSchema);
export const Task = mongoose.model<ITask>('Task', taskSchema);
export const Category = mongoose.model<ICategory>('Category', categorySchema);
export const TaskCategory = mongoose.model<ITaskCategory>('TaskCategory', taskCategorySchema);