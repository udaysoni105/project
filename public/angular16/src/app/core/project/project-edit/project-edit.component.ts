import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  projectForm!: FormGroup;
  projectId!: string;
  projects: any[] = [];
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService,
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

    this.route.params.subscribe((params) => {
      this.projectId = params['id'];
      this.loadProjectDetails();
    });
  }

  loadProjectDetails(): void {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      projectId: this.projectId,
      Permission: 'update_project' // Add the Permission header with the desired value
    });

    // Make the API call with the headers and project ID
    this.projectService.getProjectById(this.projectId, headers).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
        this.projects = response;
        this.projectForm.patchValue(response); // Update the form with the project data
        this.loading = false; // Stop loading when the data is fetched
      },
      (error) => {
        // Handle the error here
        console.error(error);
      }
    );
  }

  cancel() {
    // You can add logic here to navigate to a different page or reset the form
    this.router.navigate(['/projects']); // Navigate to another page
    // Or reset the form, if needed
    this.projectForm.reset();
  }

  saveChanges(): void {
    this.loading = true;
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      const jwtToken = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (!jwtToken) {
        console.error('JWT token not found in local storage. Please log in.');
        return;
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
        Permission: 'update_project' // Add the Permission header with the desired value
      });

      this.projectService.updateProject(this.projectId, projectData, headers).subscribe(
        (response) => {
          console.log('Project updated successfully', response);
          console.log('Project ID:', this.projectId);
          this.loading = false; // Stop loading when the data is fetched
          // Show the success message using the MessageService
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project is updated' });

          // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
          setTimeout(() => {
            this.router.navigate(['/projects']);
          }, 1500);
        },
        (error) => {
          console.error('Failed to update project', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update project',
          });
        }
      );
    } else {
      console.error('Invalid form data');
    }
  }
}




