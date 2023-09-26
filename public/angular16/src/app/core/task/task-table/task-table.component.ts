import { Component, OnInit, ViewChild, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { TaskService } from '../task.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { PageEvent } from '@angular/material/paginator';

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
  date: Date | undefined;
  userRoles: string[] = [];
  loading: boolean = false;
  start_date: Date | null | undefined;
  end_date: Date | null | undefined;
  isStartDateSelected: boolean = false;
  isEndDateSelected: boolean = false;
  originalTasks: any[] = [];
  noDateFound = 0;
  baseUrl = 'http://localhost:8000/api/tasks';
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
        this.noDateFound=0;
        if (response !== null && response !== undefined) {
          this.originalTasks = response;
          this.tasks = response;
          this.loading = false;
          // Trigger change detection manually
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'task data not show' });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }
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

  cancel() {
    this.start_date = null;
    this.end_date = null;
    this.isStartDateSelected = false;
    this.isEndDateSelected = false;
    this.tasks = this.originalTasks; // Reset the displayed tasks to the original data
  }


  /** 
* @author : UDAY SONI
* Method name: applyDateFilter
* Implement the applyDateFilter method
*/
  applyDateFilter() {
    if (this.isStartDateSelected && this.isEndDateSelected) {
      const start_date = this.start_date?.toISOString();
      const end_date = this.end_date?.toISOString();
      this.loadFilteredTasks(start_date, end_date);
    } else {
    }
  }

  /** 
* @author : UDAY SONI
* Method name: loadFilteredTasks
* Update the loadFilteredTasks method to include both start_date and end_date
*/
  loadFilteredTasks(start_date: string | undefined, end_date: string | undefined) {
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

    // Add the start_date and end_date as query parameters
    const params = {
      start_date: start_date || '',
      end_date: end_date || '',
    };

    // Modify the URL to include query parameters
    const url = `${this.baseUrl}/filter`;

    this.taskService.getFilteredTasks(url, { headers, params }).subscribe(
      (response) => {
        if (response !== null && response !== undefined) {
          this.tasks = response;
          // this.originalTasks = response;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadFilteredTasks not show' });
          setTimeout(() => {
          }, 1500);
        }
      },
      (error) => {
        this.loading = false;
        // Handle error
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
        if (response !== null && response !== "") {
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'onSortChange not works' });
          setTimeout(() => {
          }, 1500);
        }
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
        if (response !== null && response !== "") {
          this.tasks = response.data;
          this.table.totalRecords = response.total;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadPaginatedTasks not works' });
          setTimeout(() => {
          }, 1500);
        }
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
        if (response !== null && response !== "") {
          this.loading = false;
          this.loadTasks();
          this.tasks = this.tasks.filter((task) => task.id !== id);
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task is Hard deleted',
          });
          setTimeout(() => { }, 1500);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadPaginatedTasks not works' });
          setTimeout(() => {
          }, 1500);
        }
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
        if (response !== null && response !== "") {
          this.tasks = response.data;
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadPaginatedTasks not works' });
          setTimeout(() => {
          }, 1500);
        }
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
          if (response !== null && response !== "") {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'successfully download pdf',
            });
            setTimeout(() => { }, 1500);
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadPaginatedTasks not works' });
            setTimeout(() => {
            }, 1500);
          }
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
        if (response !== null && response !== "") {
          task.status = newStatus;
          this.loading = false;
          this.loadTasks();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task status updated successfully',
          });
          setTimeout(() => { }, 1500);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadPaginatedTasks not works' });
          setTimeout(() => {
          }, 1500);
        }
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
