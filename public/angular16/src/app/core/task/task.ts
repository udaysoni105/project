export interface Task {
  id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  is_completed: boolean;
  projectId: number;
  UserId: number;
}
