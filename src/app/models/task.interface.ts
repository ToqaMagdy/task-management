export interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
  dueDate: Date;
  priority: string;
  createdBy: string;
}
