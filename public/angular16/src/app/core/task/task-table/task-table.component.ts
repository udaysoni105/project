import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss'],
})
export class TaskTableComponent implements OnInit {
  tasks: any[] = [];
  searchQuery: string = '';
  @ViewChild('table') table!: Table;
  selectedValue: string = '';
  task: any = { status: 'pending' }; 
  Status: any[] = [
    { name: 'Pending' },
    { name: 'completed' }
  ];
  constructor(
    private taskService: TaskService,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  ngOnInit() {
    this.loadTasks();
  }
  // Method to fetch tasks from the API
  loadTasks() {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: 'email',
      Permission: 'view_tasks', // Add the Permission header with the desired value
    });

    // Make the API call with the headers
    this.taskService.getAllTasks(headers).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
        this.tasks = response; // Assuming the API returns an array of tasks
      },
      (error) => {
        // Handle the error here
        console.error(error);
      }
    );
  }


  deleteTask(id: string) {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      Permission: 'delete_tasks', // Add the Permission header with the desired value
    });

    this.taskService.deletetask(id, headers).subscribe(
      (response) => {
        console.log('task hard deleted successfully');
        this.loadTasks();
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task is Hard deleted',
        });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => {}, 1500);
      },
      (error) => {
        console.log('Soft delete failed:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete task',
        });
      }
    );
  }

  // onSearch(): void {
  //   this.table.filter(this.searchQuery, 'name', 'contains');
  // }
  onSearch(): void {
    if (typeof this.searchQuery === 'string') {
      this.searchQuery = this.searchQuery.trim();
    }
    this.table.filter(this.searchQuery, 'name', 'contains');
  }

  generatePDF(taskId: string): void {
    this.taskService.generatePDF(taskId);
  }
  getStatusOptions(): string[] {
    return this.tasks.map((task) => task.status);
  }
  updateTaskStatus(task: any, newStatus: string): void {
    const jwtToken = localStorage.getItem('token');
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      Permission: 'update_status', // Add the required permission
    });

    const updatedTask = { ...task, status: newStatus };
    this.taskService.updateTask(task.id, updatedTask, headers).subscribe(
      (response) => {
        console.log('Task status updated successfully');
        task.status = newStatus; // Update the status in the tasks array on success
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task status updated successfully',
        });
      },
      (error) => {
        console.log('Failed to update task status:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status',
        });
      }
    );
  }
}
