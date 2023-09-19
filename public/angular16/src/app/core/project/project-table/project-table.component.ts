import { Component, EventEmitter, Output, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { PageEvent } from '@angular/material/paginator';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss'],
})
export class ProjectTableComponent {
  projects: any[] = [];
  searchQuery: string = '';
  @ViewChild('table') table!: Table;
  loading: boolean = false;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];
  pageSize: any;
  sortDirection: string = 'asc';
  sortColumn: string = 'id';
  paginator: any;

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loadProjects();
  }

  /** 
  * @author : UDAY SONI
  * using angular pipe
  */
  displayNA(value: any): string {
    return value !== null && value !== undefined ? value : 'N.A';
  }

  /** 
  * @author : UDAY SONI
  * Method name: loadProjects
  * Method to fetch projects from the API
  * Add the Permission header with the desired value
  * Make the API call with the headers
  * Handle 404 error - navigate to a 404 page
  * Handle 401 error - navigate to a 401 page
  * Trigger change detection manually
  * Assuming the API returns an array of projects
  * Stop loading when the data is fetched
  */
  loadProjects() {
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
      Permission: 'view_project',
    });
    this.projectService.getAllProjects(headers).subscribe(
      (response) => {
        this.projects = response;
        this.loading = false;
        this.changeDetectorRef.detectChanges();
      },
      (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.router.navigate(['/404']);
        } else if (error.status === 401) {
          this.router.navigate(['/401']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load projects',
          });
          this.router.navigate(['/401']);
        }
      }
    );
  }

  /** 
  * @author : UDAY SONI
  * Method name: onSortChange
  * Call the service method to fetch sorted projects
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
    this.projectService.getSortedProjects(column, direction, headers).subscribe(
      (response) => {
      },
      (error) => {
      }
    );
  }

  /** 
  * @author : UDAY SONI
  * Method name: loadPaginatedProjects
  * Send a GET request to your Laravel API with pagination parameters
  * Update the paginator's length based on the total count from the API
  * Trigger change detection manually
  */
  loadPaginatedProjects(page: number = 1, perPage: number = 10) {
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
      Permission: 'view_project',
    });
    this.projectService.getPaginatedProjects(page, perPage, headers).subscribe(
      (response) => {
        this.projects = response.data;
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
  * Page index is 0-based, so add 1
  */
  onPageChange(event: PageEvent): void {
    const page = event.pageIndex + 1;
    const perPage = event.pageSize;
    this.loadPaginatedProjects(page, perPage);
  }

  /** 
  * @author : UDAY SONI
  * Method name: softDeleteProject
  * Add the Permission header with the desired value
  * Check if the project has associated tasks
  * Project has tasks, show a message and do not perform soft delete
  * No associated tasks, perform the soft delete
  * Remove the deleted project from the projects list
  * Show the success message using the MessageService
  * Stop loading when the data is fetched
  */
  softDeleteProject(id: number) {
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
      Permission: 'delete_project',
    });
    this.projectService.getTasksByProjectId(id).subscribe(
      (tasks) => {
        if (tasks.length > 0) {
          this.loading = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Project has associated tasks and cannot be deleted.',
          });
          setTimeout(() => { }, 1500);
        } else {
          this.projectService.softDeleteProject(id, headers).subscribe(
            (response) => {
              this.projects = this.projects.filter((project) => project.id !== id);
              this.loading = false;
              this.changeDetectorRef.detectChanges();
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project is soft deleted',
              });
              setTimeout(() => { }, 1500);
            },
            (error) => {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to soft delete project',
              });
              setTimeout(() => { }, 1500);
            }
          );
        }
      },
      (error) => {
        console.error('Failed to fetch tasks:', error);
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to soft delete project',
        });
        setTimeout(() => { }, 1500);
      }
    );
  }

  /** 
  * @author : UDAY SONI
  * Method name: getProjects
  * Stop loading when the data is fetched
  */
  getProjects(): void {
    this.projectService.getProjects().subscribe(
      (response) => {
        this.projects = response;
        this.loading = false;
      },
      (error) => {
        this.loading = false;
      }
    );
  }

  /** 
  * @author : UDAY SONI
  * Method name: onSearch
  * Add the Permission header with the desired value
  * Extract the 'data' array from the response
  * 
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
      Permission: 'view_project',
    });
    this.projectService.searchProjects(this.searchQuery, headers).subscribe(
      (response) => {
        this.projects = response.data;
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
