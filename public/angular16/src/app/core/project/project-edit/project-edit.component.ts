import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-project-edit',
  templateUrl: './project-edit.component.html',
  styleUrls: ['./project-edit.component.scss'],
})
export class ProjectEditComponent implements OnInit {
  projectForm!: FormGroup;

  project = {
    name: '',
    description: '',
    start_date: '',
    end_date: '',
    status: '',
  };

  constructor(
    private formBuilder: FormBuilder,
    private projectService: ProjectService
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

  saveChanges(): void {
    if (this.projectForm.valid) {
      this.projectService.saveChanges(this.project).subscribe(
        (response) => {
          console.log('Project edited successfully', response);
        },
        (error) => {
          console.error('Failed to edit project', error);
        }
      );
    }
  }
}
