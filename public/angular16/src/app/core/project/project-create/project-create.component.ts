import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})

export class ProjectCreateComponent implements OnInit {
  projectForm!: FormGroup;
  loading: boolean = false;
  today: string = new Date().toISOString().split('T')[0];
  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
    // Add a listener for changes in the end_date field
    this.projectForm.get('end_date')?.valueChanges.subscribe((endDate) => {
      const startDate = this.projectForm.get('start_date')?.value;

      // Check if end_date is smaller than start_date
      if (endDate < startDate) {
        // Clear the start_date field
        this.projectForm.get('start_date')?.setValue('');
      }
    });
  }

  /** 
* @author : UDAY SONI
* Method name: createProject
* Stop loading when the data is fetched
* Stop loading when the data is fetched
*/
  createProject() {
    this.loading = true;

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      this.projectService
        .createProject(this.projectForm.value, token, email)
        .subscribe(
          (response) => {
            if (response !== null && response !== "") {
              this.projectForm.reset();
              this.loading = false;
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Project is created'
              });
              setTimeout(() => {
                this.router.navigate(['/projects']);
              }, 1500);
            }
            else {
              this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'create unsuccessfully' });
              setTimeout(() => {
              }, 1500);
            }
          },
          (error) => {
            this.loading = false;
            if (error.status === 404) {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Resource not found (404)',
              });
              this.router.navigate(['/404']);
            }
            else if (error.status === 404) {
              this.loading = false;
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Failed to create project',
              });
              setTimeout(() => {
              }, 1500);
            } else {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Unauthorized (401)',
              });
              this.router.navigate(['/401']);
            }

          }
        );
    }
    else {
      this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'user not found' });
      setTimeout(() => {
      }, 1500);
    }
    (error: any) => {
      this.loading = false;
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to create project',
      });
    };
  }
  /** 
* @author : UDAY SONI
* Method name: cancel
* Navigate to another page
* Or reset the form, if needed
*/
  cancel() {
    this.router.navigate(['/projects']);
    this.projectForm.reset();
  }
}
