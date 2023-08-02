import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
import { MessageService } from 'primeng/api';
import { ReactiveService } from '../../reactive/reactive.service';

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

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private reactiveService: ReactiveService
  ) { }

  ngOnInit() {
    this.loadProjects();
  }

  // Method to fetch projects from the API
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
      email: 'email',
      Permission: 'view_project', // Add the Permission header with the desired value
    });

    // Make the API call with the headers
    this.projectService.getAllProjects(headers).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
        this.projects = response; // Assuming the API returns an array of projects
        this.loading = false; // Stop loading when the data is fetched

      },
      (error) => {
        // Handle the error here
        console.error(error);
        this.loading = false; // Stop loading when the data is fetched
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

    this.projectService.softDeleteProject(id, headers).subscribe(
      (response) => {
        console.log('Project soft deleted successfully');

        this.projects = this.projects.filter((project) => project.id !== id);
        // Show the success message using the MessageService
        this.loading = false; // Stop loading when the data is fetched
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project is soft delete' });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => {
        }, 1500);
      },
      (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false; // Stop loading when the data is fetched
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to softDelete project',
        });
      }
    );
  }

  getProjects(): void {
    this.loading = true;
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

  // onSearch(): void {
  //   this.table.filter(this.searchQuery, 'name', 'contains');
  // }

  // onSort(event: SortEvent): void {
  //   // Implement the sorting logic here
  // }

  onSearch(): void {
    this.loading = true;
    this.projectService.searchProjects(this.searchQuery).subscribe(
      (response) => {
        console.log('Search Response:', response);
        this.projects = response.data; // Extract the 'data' array from the response
        this.loading = false; // Stop loading when the data is fetched
      },
      (error) => {
        console.log(error);
        this.loading = false; // Stop loading when the data is fetched
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
          this.loading = false; // Stop loading when the data is fetched
        },
        (error) => {
          console.log(error);
          this.loading = false; // Stop loading when the data is fetched
        }
      );
    }
  }

}
