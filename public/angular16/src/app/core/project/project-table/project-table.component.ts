import { Component, OnInit, ViewChild } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss'],
})
export class ProjectTableComponent implements OnInit {
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

  softDeleteProject(id: number) {
    this.projectService.softDeleteProject(id).subscribe(
      (response) => {
        console.log('Project soft deleted successfully');
      },
      (error) => {
        console.log('Soft delete failed:', error);
      }
    );
  }

  onSearch(): void {
    this.table.filter(this.searchQuery, 'name', 'contains');
  }

  onSort(event: SortEvent): void {
    // Implement the sorting logic here
  }
}
