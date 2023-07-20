export interface Project {
    id: number;
    name: string;
    description: string;
    start_date: string; // Date in ISO 8601 format as a string (e.g., '2023-07-20')
    end_date: string; // Date in ISO 8601 format as a string (e.g., '2023-07-31')
    status: 'pending' | 'running' | 'completed';
  }
  