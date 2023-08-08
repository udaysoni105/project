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
  userRoles: string[] = [];
  loading: boolean = false;
  constructor(
    private taskService: TaskService,
    private router: Router,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.loadTasks();
  }
  // Method to fetch tasks from the API
  loadTasks() {
    this.loading = true;
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
        this.loading = false; // Stop loading when the data is fetched
      },
      (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false;

        if (error.status === 404) {
          this.router.navigate(['Not Found']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
          this.router.navigate(['Not Found']);
        }

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 5000); // 5 seconds delay
      }

    );
  }

  isAdminOrProjectManager(): boolean {
    return this.userRoles.includes('Admin') || this.userRoles.includes('projectManager');
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
        console.log('task hard deleted successfully', response);
        this.loading = false; // Stop loading when the data is fetched
        this.loadTasks();
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task is Hard deleted',
        });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => { }, 1500);
      },
      (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false; // Stop loading when the data is fetched
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete task',
        });
      }
    );
  }

  onSearch(): void {
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


    this.taskService.searchTasks(this.searchQuery, headers).subscribe(
      (response) => {
        console.log('Search Response:', response);
        this.tasks = response.data; // Extract the 'data' array from the response
      },
      (error) => {
        console.log(error);
      }
    );
  }

  generatePDF(taskId: string): void {
    this.taskService.generatePDF(taskId);
  }

  getStatusOptions(): string[] {
    return this.tasks.map((task) => task.status);
  }

  updateTaskStatus(task: any, newStatus: string): void {
    this.loading = true;
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
    this.taskService.updateTasks(task.id, updatedTask, headers).subscribe(
      (response) => {
        console.log('Task status updated successfully', response);
        task.status = newStatus; // Update the status in the tasks array on success
        this.loading = false; // Stop loading when the data is fetched
        this.loadTasks();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task status updated successfully',
        });
      },
      (error) => {
        console.log('Failed to update task status:', error);
        this.loading = false; // Stop loading when the data is fetched
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status',
        });
      }
    );
  }
}
