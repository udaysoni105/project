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
  today: string = new Date().toISOString().split('T')[0];

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

  /** 
* @author : UDAY SONI
* Method name: loadProjectDetails
* Add the Permission header with the desired value
* Make the API call with the headers and project ID
* Update the form with the project data
* Stop loading when the data is fetched
*/
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
      'email': `${email}`,
      projectId: this.projectId,
      Permission: 'update_project'
    });
    this.projectService.getProjectById(this.projectId, headers).subscribe(
      (response) => {
        this.projects = response;
        this.projectForm.patchValue(response);
        this.loading = false;
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project edit data show' });
        setTimeout(() => { }, 1500);
      },
      (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'project edit data not found',
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
    this.projectForm.reset();
  }

  /** 
* @author : UDAY SONI
* Method name: saveChanges
* Add the Permission header with the desired value
* Stop loading when the data is fetched
* Show the success message using the MessageService
*/
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
        'email': `${email}`,
        Permission: 'update_project'
      });
      this.projectService.updateProject(this.projectId, projectData, headers).subscribe(
        (response) => {
          this.loading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Project is updated' });
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
          setTimeout(() => { }, 1500);
        }
      );
    } else {
      console.error('Invalid form data');
    }
  }
}
