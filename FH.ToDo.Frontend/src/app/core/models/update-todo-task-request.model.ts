export interface UpdateTodoTaskRequest {
  title: string;
  listId: string;
  dueDate?: string | null;
}
