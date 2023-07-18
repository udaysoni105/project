import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss']
})
export class ProjectEditComponent implements OnInit {
  projectForm!: FormGroup;
  projectId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private projectService: ProjectService
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: ['', Validators.required],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      status: ['', Validators.required]
    });

    this.route.params.subscribe(params => {
      this.projectId = params['id'];
      this.loadProjectDetails();
    });
  }

  loadProjectDetails(): void {
    this.projectService.getProjectById(this.projectId).subscribe(
      response => {
        this.projectForm.patchValue(response);
      },
      error => {
        console.error('Failed to retrieve project details', error);
      }
    );
  }

  saveChanges(): void {
    if (this.projectForm.valid) {
      const projectData = this.projectForm.value;
      this.projectService.updateProject(this.projectId, projectData).subscribe(
        response => {
          console.log('Project updated successfully', response);
        },
        error => {
          console.error('Failed to update project', error);
        }
      );
    } else {
      console.error('Invalid form data');
    }
  }
}
