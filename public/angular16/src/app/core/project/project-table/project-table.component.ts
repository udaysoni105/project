import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Token } from '@angular/compiler';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss'],
})
export class ProjectTableComponent {
  projects: any[] = [];
  searchQuery: string = '';
  @ViewChild('table') table!: Table;

  constructor(private projectService: ProjectService) {}

  ngOnInit() {
    this.loadProjects();
  }

    // Method to fetch projects from the API
    loadProjects() {
      const jwtToken = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      if (!jwtToken) {
        console.error('JWT token not found in local storage. Please log in.');
        return;
      }
    
      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
        email :'email',
        Permission: 'view_project' // Add the Permission header with the desired value
      });
    
      // Make the API call with the headers
      this.projectService.getAllProjects(headers).subscribe(
        (response) => {
          // Handle the response here
          console.log(response);
          this.projects = response; // Assuming the API returns an array of projects
        },
        (error) => {
          // Handle the error here
          console.error(error);
        }
      );
    }

  softDeleteProject(id: number) {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
  
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }
  
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      Permission: 'delete_project' // Add the Permission header with the desired value
    });
  
    this.projectService.softDeleteProject(id, headers).subscribe(
      (response) => {
        console.log('Project soft deleted successfully');
        this.projects = this.projects.filter((project) => project.id !== id);
      },
      (error) => {
        console.log('Soft delete failed:', error);
      }
    );
  }

  // onSearch(): void {
  //   this.table.filter(this.searchQuery, 'name', 'contains');
  // }

  // onSort(event: SortEvent): void {
  //   // Implement the sorting logic here
  // }

  getProjects(): void {
    this.projectService.getProjects().subscribe(
      (response) => {
        this.projects = response;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSearch(): void {
    this.projectService.searchProjects(this.searchQuery).subscribe(
      (response) => {
        console.log('Search Response:', response);
        this.projects = response.data; // Extract the 'data' array from the response
      },
      (error) => {
        console.log(error);
      }
    );
  }

  onSort(event: SortEvent): void {
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

