import { Component, OnInit } from '@angular/core';
import { ReactiveService } from '../reactive.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss']
})
export class ReactiveComponent implements OnInit {
  softDeletedProjects: any[] = [];

  constructor(private reactiveService: ReactiveService) {}

  ngOnInit(): void {
    // Replace the '12' with the specific project ID you want to fetch soft-deleted projects for
    this.loadSoftDeletedProjects(12);
  }

  loadSoftDeletedProjects(projectId: number) {
    this.reactiveService.getSoftDeletedProjects(projectId).subscribe(
      (response) => {
        this.softDeletedProjects = response;
      },
      (error) => {
        console.error('Failed to fetch soft-deleted projects', error);
      }
    );
  }

  restoreProject(projectId: number) {
    this.reactiveService.restoreProject(projectId).subscribe(
      (response) => {
        console.log('Project restored successfully', response);
        // After restoring, reload the soft-deleted projects
        this.loadSoftDeletedProjects(projectId);
      },
      (error) => {
        console.error('Failed to restore project', error);
      }
    );
  }
}
