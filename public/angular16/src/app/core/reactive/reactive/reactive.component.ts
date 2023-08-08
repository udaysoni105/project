import { Component, OnInit } from '@angular/core';
import { ReactiveService } from '../reactive.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss']
})
export class ReactiveComponent implements OnInit {
  softDeletedProjects: any[] = [];
  isLoading: boolean = false; // New loading flag
  constructor(private router: Router, private messageService: MessageService, private reactiveService: ReactiveService) { }

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
  restoreProject(id: number) {
    this.reactiveService.restoreProject(id).subscribe(
      (response) => {
        console.log('Project restored successfully', response);
        // Mark the project as restored
        const restoredProject = this.softDeletedProjects.find(project => project.id === id);
        if (restoredProject) {
          restoredProject.isRestored = true;
        }
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project is created' });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => {
          this.router.navigate(['/projects']);
        }, 1500);
      },
      (error) => {
        console.error('Error restoring project:', error);
      }
    );
  }

}

