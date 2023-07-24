import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
@Component({
  selector: 'app-project-create',
  templateUrl: './project-create.component.html',
  styleUrls: ['./project-create.component.scss'],
})
export class ProjectCreateComponent implements OnInit {
  projectForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required],
    });
  }

  createProject() {
    console.log(this.projectForm);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      this.projectService
        .createProject(this.projectForm.value, token, email)
        .subscribe(
          (response) => {
            console.log('Project created successfully', response);
            this.router.navigate(['/projects']);
            // Handle success, e.g., show a success message or redirect to another page
          },
          (error) => {
            console.error('Failed to create project', error);
            // Handle error, e.g., show an error message
          }
        );
    }
  }
}
