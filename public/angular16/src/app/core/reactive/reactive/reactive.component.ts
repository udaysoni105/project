import { Component, OnInit } from '@angular/core';
import { ReactiveService } from '../reactive.service';

@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss']
})
export class ReactiveComponent implements OnInit {
  softDeletedProjects: any[] = [];
  isLoading: boolean = false; // New loading flag
  constructor(private reactiveService: ReactiveService) { }

  ngOnInit(): void {
    this.loadSoftDeletedProjects(50);
  }

  loadSoftDeletedProjects(projectId: number) {
    this.isLoading = true; // Set loading to true before the request
    this.softDeletedProjects = []; // Clear the data to remove it from the table
    this.reactiveService.getSoftDeletedProjects(projectId).subscribe(
      (response) => {
        this.softDeletedProjects = response;
        this.isLoading = false; // Set loading to false after the response is received
      },
      (error) => {
        console.error('Failed to fetch soft-deleted projects', error);
        this.isLoading = false; // Set loading to false even on error
      }
    );
  }
  // restoreProject(projectId: number) {
  //   this.isLoading = true; // Set loading to true before the request
  //   const index = this.softDeletedProjects.findIndex(project => project.id === projectId);
  //   if (index !== -1) {
  //     this.softDeletedProjects.splice(index, 1); // Remove the project from the array
  //   }

  //   this.reactiveService.restoreProject(projectId).subscribe(
  //     (response) => {
  //       console.log('Project restored successfully', response);
  //       // After restoring, do not need to reload the soft-deleted projects as the restored project was already removed
  //       this.isLoading = false; // Set loading to false after the response is received
  //     },
  //     (error) => {
  //       console.error('Failed to restore project', error);
  //       this.isLoading = false; // Set loading to false even on error
  //     }
  //   );
  // }
  restoreProject(projectId: number) {
    this.isLoading = true; // Set loading to true before the request
    const index = this.softDeletedProjects.findIndex(project => project.id === projectId);
    if (index !== -1) {
      this.softDeletedProjects.splice(index, 1); // Remove the project from the array

      this.reactiveService.restoreProject(projectId).subscribe(
        (response) => {
          console.log('Project restored successfully', response);
          // After restoring, do not need to reload the soft-deleted projects as the restored project was already removed
          this.isLoading = false; // Set loading to false after the response is received
        },
        (error) => {
          console.error('Failed to restore project', error);
          this.isLoading = false; // Set loading to false even on error
        }
      );
    } else {
      console.warn('Project not found in softDeletedProjects array.'); // Optionally, you can show a warning if the project is not found
      this.isLoading = false; // Set loading to false since there's no need to make a restore request
    }
  }

}
