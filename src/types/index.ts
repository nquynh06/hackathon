export type Board = {
  id: string;
  title: string;
};

export type Requirement = {
  id: string;
  text: string;
  done: boolean;
};

export type Mood = {
  label: string;
  color: string;
};

export type Task = {
  id: string;
  title: string;
  requirements?: Requirement[];
  taskType: string;
  startDate?: string;   
  dueDate?: string;
  status: string;
  priority: string;
  boardId: string;
  createdDate?: string;
  actualDoneDate?: string;
  order?: number; 
  mood?: string; 
};
