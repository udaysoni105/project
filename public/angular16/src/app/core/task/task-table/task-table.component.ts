import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { TaskService } from '../task.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

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
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadTasks();
  }

  displayNA(value: any): string {
    return value !== null && value !== undefined ? value : 'N.A';
  }

  /** 
* @author : UDAY SONI
* Method name: loadTasks
* Method to fetch tasks from the API
* Add the Permission header with the desired value
* Assuming the API returns an array of tasks
* Make the API call with the headers
* Stop loading when the data is fetched
*/
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
      'email': `${email}`,
      Permission: 'view_tasks',
    });

    this.taskService.getAllTasks(headers).subscribe(
      (response) => {
        this.tasks = response;
        this.loading = false;
        // Trigger change detection manually
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.loading = false;

        if (error.status === 404) {
          this.router.navigate(['/404']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
        }
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: onSortChange
* Make the API call with the headers
* Call the service method to fetch sorted projects
* Handle the response data here
* Update your component's data with the sorted projects
*/
  onSortChange(column: string, direction: string,) {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: `${email}`,
      Permission: 'view_project',
    });
    this.taskService.getSortedtasks(column, direction, headers).subscribe(
      (response) => {
      },
      (error) => {
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: loadPaginatedTasks
* Make the API call with the headers
* Send a GET request to your Laravel API with pagination parameters
* Update the paginator's length based on the total count from the API
* Trigger change detection manually
* Page index is 0-based, so add 1
*/
  loadPaginatedTasks(page: number = 1, perPage: number = 10) {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: `${email}`,
      Permission: 'view_tasks',
    });
    this.taskService.getPaginatedTasks(page, perPage, headers).subscribe(
      (response) => {
        this.tasks = response.data;
        this.table.totalRecords = response.total;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: onPageChange
* loadPaginatedTasks page and perpage event 
*/
  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const perPage = event.pageSize;
    this.loadPaginatedTasks(page, perPage);
  }

  /** 
* @author : UDAY SONI
* Method name: isAdminOrProjectManager
*/
  isAdminOrProjectManager(): boolean {
    return this.userRoles.includes('Admin') || this.userRoles.includes('projectManager');
  }

  /** 
* @author : UDAY SONI
* Method name: deleteTask
* Add the Permission header with the desired value
* Stop loading when the data is fetched
* Stop loading when the data is fetched
*/
  deleteTask(id: string) {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'email': `${email}`,
      Permission: 'delete_tasks',
    });

    this.taskService.deletetask(id, headers).subscribe(
      (response) => {
        this.loading = false;
        this.loadTasks();
        this.tasks = this.tasks.filter((task) => task.id !== id);
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task is Hard deleted',
        });
        setTimeout(() => { }, 1500);
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete task unauthorized',
        });
        setTimeout(() => { }, 1500);
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: onSearch
* Add the Permission header with the desired value
* Extract the 'data' array from the response
* Stop loading when the data is fetched
*/
  onSearch(): void {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'email': `${email}`,
      Permission: 'view_tasks',
    });


    this.taskService.searchTasks(this.searchQuery, headers).subscribe(
      (response) => {
        this.tasks = response.data;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: generatePDF
*/
  generatePDF(taskId: string): void {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      // const task = this.taskForm.value;
      this.taskService.generatePDF(taskId, token, email).subscribe(
        (response) => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'successfully download pdf',
          });
          setTimeout(() => { }, 1500);
        },
        (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed pdf download',
          });
          setTimeout(() => { }, 1500);
        }
      );
    }
  }

  /** 
* @author : UDAY SONI
* Method name: getStatusOptions
*/
  getStatusOptions(): string[] {
    return this.tasks.map((task) => task.status);
  }

  /** 
* @author : UDAY SONI
* Method name: updateTaskStatus
* Add the required permission
* Update the status in the tasks array on success
* Stop loading when the data is fetched
* Stop loading when the data is fetched
*/
  updateTaskStatus(task: any, newStatus: string): void {

    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'email': `${email}`,
      Permission: 'update_status',
    });

    const updatedTask = { ...task, status: newStatus };
    this.taskService.updateTasks(task.id, updatedTask, headers).subscribe(
      (response) => {
        task.status = newStatus;
        this.loading = false;
        this.loadTasks();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task status updated successfully',
        });
        setTimeout(() => { }, 1500);
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task unothorized',
        });
        setTimeout(() => { }, 1500);
      }
    );
  }
}
