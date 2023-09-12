import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { MessageService } from 'primeng/api';
import { ReactiveService } from '../../reactive/reactive.service';
import { Router } from '@angular/router';
interface PageEvent {
  first: number;
  rows: number;
  page: number;
  pageCount: number;
}
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
  first2: number = 0;
  rows2: number = 10;
  totalRecords: number = 120;

  options = [
      { label: 5, value: 5 },
      { label: 10, value: 10 },
      { label: 20, value: 20 },
      { label: 120, value: 120 }
  ];



  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private reactiveService: ReactiveService,
    private router: Router
  ) { }

  ngOnInit() {
    this.loadProjects();
  }
  onPageChange2(event: PageEvent) {
    this.first2 = event.first;
    this.rows2 = event.rows;
}

  // Method to fetch projects from the API
  loadProjects() {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    // console.log(jwtToken);
    // console.log(email);
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: 'email',
      Permission: 'view_project', // Add the Permission header with the desired value
    });
    // console.log(headers);
    // Make the API call with the headers
    this.projectService.getAllProjects(headers).subscribe(
      (response) => {
        // Handle the response here
        // console.log(response);
        this.projects = response; // Assuming the API returns an array of projects
        this.loading = false; // Stop loading when the data is fetched

      },
      // (error) => {
      //   // Handle the error here
      //   console.log(error);
      //   this.loading = false; // Stop loading when the data is fetched
      //   if (error.status === 403) {
      //     // Unauthorized or Forbidden
      //     this.router.navigate(['/**']); // Navigate to the custom 404 page
      //   }
      // }
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
      Permission: 'delete_project', // Add the Permission header with the desired value
    });
  
    // Check if the project has associated tasks
    this.projectService.getTasksByProjectId(id).subscribe(
      (tasks) => {
        if (tasks.length > 0) {
          // Project has tasks, show a message and do not perform soft delete
          this.loading = false;
          this.messageService.add({
            severity: 'warn',
            summary: 'Warning',
            detail: 'Project has associated tasks and cannot be deleted.',
          });
        } else {
          // No associated tasks, perform the soft delete
          this.projectService.softDeleteProject(id, headers).subscribe(
            (response) => {
              // Remove the deleted project from the projects list
              this.projects = this.projects.filter((project) => project.id !== id);
              // Show the success message using the MessageService
              this.loading = false; // Stop loading when the data is fetched
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project is soft deleted',
              });
            },
            (error) => {
              console.log('Soft delete failed:', error);
              this.loading = false; // Stop loading when the data is fetched
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to soft delete project',
              });
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
          detail: 'Failed to check associated tasks',
        });
      }
    );
  }

  getProjects(): void {
    this.projectService.getProjects().subscribe(
      (response) => {
        this.projects = response;
        this.loading = false; // Stop loading when the data is fetched
      },
      (error) => {
        console.log(error);
        this.loading = false;
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
      Permission: 'view_project', // Add the Permission header with the desired value
    });


    this.projectService.searchProjects(this.searchQuery, headers).subscribe(
      (response) => {
        // console.log('Search Response:', response);
        this.projects = response.data; // Extract the 'data' array from the response
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSort(event: SortEvent): void {
    this.loading = true;
    const column: string | undefined = event.field;
    const direction: string = event.order === 1 ? 'asc' : 'desc';

    if (column) {
      this.projectService.getSortedProjects(column, direction).subscribe(
        (response) => {
          this.projects = response;
        },
        (error) => {
          console.log(error);
        }
      );
    }
  }

}
