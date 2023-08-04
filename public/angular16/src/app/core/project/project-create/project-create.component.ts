import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private http: HttpClient,
    private router: Router,
    private messageService: MessageService 
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required]
    });
  }

  createProject() {
    this.loading = true;
    console.log(this.projectForm);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      this.projectService
        .createProject(this.projectForm.value, token, email)
        .subscribe(
          (response) => {
            console.log('Project created successfully', response);
            this.projectForm.reset();
            this.loading = false; // Stop loading when the data is fetched
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project is created' });

            // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
            setTimeout(() => {
              this.router.navigate(['/projects']);
            },1500 );
          },
          (error) => {
            console.error('Failed to create project', error);
            this.loading = false; // Stop loading when the data is fetched
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create project',
            });
          }
        );
    }
  }
}
