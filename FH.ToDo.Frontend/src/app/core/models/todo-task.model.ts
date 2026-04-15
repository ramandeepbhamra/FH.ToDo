import { SubTask } from './sub-task.model';

export interface TodoTask {
  id: string;
  title: string;
  listId: string;
  isCompleted: boolean;
  completedDate: string | null;
  isFavourite: boolean;
  dueDate: string | null;
  order: number;
  createdDate: string;
  subTasks: SubTask[];
}
