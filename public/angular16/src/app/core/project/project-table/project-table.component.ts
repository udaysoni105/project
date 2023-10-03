import { Component, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ProjectService } from '../project.service';
import { Table } from 'primeng/table';
import { HttpHeaders } from '@angular/common/http';
import { MenuItem, MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { FormControl } from '@angular/forms';
@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss'],
})
export class ProjectTableComponent {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  projects: any[] = [];
  searchQuery: string = '';
  @ViewChild('table') table!: Table;
  loading: boolean = false;
  pageIndex = 0;
pageSize = 5;
pageSizeOptions = [5, 10, 25, 100];

  // pageSizeOptions = [5, 10, 25, 100];
  // pageSize:  number = 5;
  sortDirection: string = 'asc';
  sortColumn: string = 'id';
  // paginator: any;
  noDateFound=0;
  // length = 0;
  // pageIndex = 0;
  filterControl = new FormControl();
  filter: any = {
    filter: '',
  };
  public filterValue: any = null;
  public page = (1 + this.pageIndex);
  menuList!: MenuItem[];

  constructor(
    private projectService: ProjectService,
    private messageService: MessageService,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) { }

  ngOnInit() {

    this.loadProjects();
    this.loadPaginatedProjects();
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
        this.noDateFound=0;
        this.projects = response;
        if (response !== null && response !== undefined) {
          this.loading = false;
          this.noDateFound=0;
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.noDateFound=1;
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'project data not show' });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }
      },
      (error) => {
        this.loading = false;
        if (error.status === 404) {
          this.router.navigate(['/404']);
        } else if (error.status === 401) {
          this.router.navigate(['/401']);
        } else {
          this.noDateFound=1;
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

//   this.projectService.getAllProjects(headers).subscribe(
//     (response) => {
//       this.noDateFound=0;
//       this.projects = response;
//       if (response !== null && response !== undefined) {
//         this.loading = false;
//         this.noDateFound=0;
//         this.changeDetectorRef.detectChanges();
//       }
//       else {
//         this.noDateFound=1;
//                 if (response === 404) {
//         this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Project data not found' });
//       } else if (response === 401) {
//         this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Unauthorized' });
//       } else if (response == 0) {
//         this.noDateFound = 1;
//       } else {
//         this.noDateFound = 1;
//       }
//         // this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'project data not show' });
//         // setTimeout(() => {
//         //   this.router.navigate(['/login']);
//         // }, 1500);
//       }
//     },
//     (error) => {
//       this.loading = false;
//       if (error == 0) {
//         this.messageService.add({severity:'error', summary:'Error', detail: 'project data not show'});
//       } else {
//         this.messageService.add({severity:'error', summary:'Error', detail: 'project data not show'});
//       }
//     }
//   );
// }

//   this.projectService.getAllProjects(headers).subscribe(
//     (response) => {
//       this.loading = false;
//       this.noDateFound = 0;

//       if (response !== null && response !== undefined) {
//         this.projects = response;
//         this.changeDetectorRef.detectChanges();
//       } else {
//         if (response === 404) {
//           this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Project data not found' });
//         } else if (response === 401) {
//           this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'Unauthorized' });
//         } else if (response == 0) {
//           this.noDateFound = 1;
//         } else {
//           this.noDateFound = 1;
//         }
//       }
//     },
//     (error) => {
//       this.loading = false;
//       this.noDateFound = 1;
//       this.messageService.add({
//         severity: 'error',
//         summary: 'Error',
//         detail: 'Failed to load projects',
//       });
//       this.router.navigate(['/401']);
//     }
//   );
// }

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
        if (response !== null && response !== "" && response !== undefined) {
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'onSortChange unsuccessfully' });
          setTimeout(() => {
          }, 1500);
        }
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
  loadPaginatedProjects(page: number = 1, perPage: number = 5) {
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
        if (response !== null && response !== "" && response !== undefined) {
          this.projects = response.data;
          this.paginator.length = response.total;
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'loadPaginatedProjects unsuccessfully' });
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
  * Method name: onPageChange
  * Page index is 0-based, so add 1
  */
  ngAfterViewInit(): void {
    this.loadPaginatedProjects(1, this.pageSize);
  }
  
  // onPageChange(event: PageEvent): void {
  //   const page = event.pageIndex + 1;
  //   const perPage = event.pageSize;
  //   this.loadPaginatedProjects(page, perPage);
  // }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadPaginatedProjects(this.pageIndex + 1, this.pageSize);
  }

  
  getFirstPage() {
    this.loadPaginatedProjects(1, this.pageSize);
  }
  
  getNextPage() {
    if (this.pageIndex < this.paginator.getNumberOfPages()) {
      this.loadPaginatedProjects(this.pageIndex + 1, this.pageSize);
    }
  }
  
  getPreviousPage() {
    if (this.pageIndex > 1) {
      this.loadPaginatedProjects(this.pageIndex - 1, this.pageSize);
    }
  }
  
  getLastPage() {
    const lastPage = this.paginator.getNumberOfPages();
    this.loadPaginatedProjects(lastPage, this.pageSize);
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
              if (response !== null && response !== "") {
                this.projects = this.projects.filter((project) => project.id !== id);
                this.loading = false;
                this.changeDetectorRef.detectChanges();
                this.messageService.add({
                  severity: 'success',
                  summary: 'Success',
                  detail: 'Project is soft deleted',
                });
                setTimeout(() => { }, 1500);
              }
              else {
                this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'softDeleteProject unsuccessfully' });
                setTimeout(() => {
                }, 1500);
              }
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
        if (response !== null && response !== "" && response !== undefined) {
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'getProjects unsuccessfully' });
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
        if (response !== null && response !== "" && response !== undefined) {
          this.projects = response.data;
          this.changeDetectorRef.detectChanges();
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'onSearch unsuccessfully' });
          setTimeout(() => {
          }, 1500);
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
