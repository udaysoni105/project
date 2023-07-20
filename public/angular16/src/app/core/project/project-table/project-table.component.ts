import { Component, EventEmitter, Output, ViewChild } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';

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

  loadProjects() {
    this.projectService.getAllProjects().subscribe(
      (data) => {
        this.projects = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // softDeleteProject(id: number) {
  //   this.projectService.softDeleteProject(id).subscribe(
  //     (response) => {
  //       console.log('Project soft deleted successfully');
  //       this.loadProjects(); // Reload the projects after successful soft delete
  //     },
  //     (error) => {
  //       console.log('Soft delete failed:', error);
  //     }
  //   );
  // }
  softDeleteProject(id: number) {
    this.projectService.softDeleteProject(id).subscribe(
      (response) => {
        console.log('Project soft deleted successfully');
        this.projects = this.projects.filter((project) => project.id !== id); // Filter out the soft-deleted task from the array
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

