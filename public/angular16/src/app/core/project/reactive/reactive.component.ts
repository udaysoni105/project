import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../project.service';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
@Component({
  selector: 'app-reactive',
  templateUrl: './reactive.component.html',
  styleUrls: ['./reactive.component.scss']
})

export class ReactiveComponent implements OnInit {
  softDeletedProjects: any[] = [];
  loading: boolean = false;
  options = [
    { label: 5, value: 5 },
    { label: 10, value: 10 },
    { label: 20, value: 20 },
    { label: 120, value: 120 }
  ];
  constructor(private router: Router,
    private messageService: MessageService,
    private cdr: ChangeDetectorRef,
    private projectService: ProjectService) { }

  ngOnInit(): void {
    this.loadSoftDeletedProjects(150);
    this.cdr.detectChanges();
  }


  displayNA(value: any): string {
    return value !== null && value !== undefined ? value : 'N.A';
  }

  /** 
* @author : UDAY SONI
* Method name: loadSoftDeletedProjects
* Set loading to true before the request
* Clear the data to remove it from the table
* Set loading to false after the response is received
* Set loading to false even on error
*/
  loadSoftDeletedProjects(projectId: number) {
    this.loading = true;
    this.softDeletedProjects = [];
    this.projectService.getSoftDeletedProjects(projectId).subscribe(
      (response) => {
        if (response !== null && response !== null) {
          this.softDeletedProjects = response;
          this.loading = false;
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadsoftdeletedproject unsuccessfully' });
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
* Method name: restoreProject
* Mark the project as restored
*/
  restoreProject(id: number) {
    this.loading = true;
    this.projectService.restoreProject(id).subscribe(
      (response) => {
        if (response !== null && response !== "") {
          const restoredProject = this.softDeletedProjects.find(project => project.id === id);

          if (restoredProject) {
            this.loadSoftDeletedProjects(100);
            restoredProject.isRestored = true;
          }
          this.loading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project is restored' });
          setTimeout(() => {
          }, 1500);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'restoreProject unsuccessfully' });
          setTimeout(() => {
          }, 1500);
        }
      },
      (error) => {
        this.loading = false;
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to check associated tasks',
        });
        setTimeout(() => { }, 1500);
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: cancel
* Navigate to another page
* Or reset the form, if needed
*/
  cancel() {
    this.router.navigate(['/projects']);
  }
}

