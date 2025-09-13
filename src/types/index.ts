export type Board = {
  id: string;
  title: string;
};

export type Task = {
  id: string;
  title: string;
  description?: string;
  taskType: string;
  startDate?: string;   
  dueDate?: string;
  status: string;
  priority: string;
  boardId: string;
  createdDate?: string;
  actualDoneDate?: string;
  order?: number; 
};
