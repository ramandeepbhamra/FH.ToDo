export interface CreateTodoTaskRequest {
  title: string;
  listId: string;
  dueDate?: string | null;
}
