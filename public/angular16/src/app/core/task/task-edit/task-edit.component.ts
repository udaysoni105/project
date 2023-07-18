import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  taskId!: string;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_completed: [false],
      project_id: ['', Validators.required],
    });

    this.route.params.subscribe((params) => {
      this.taskId = params['id'];
      this.loadTaskDetails();
    });
  }

  loadTaskDetails(): void {
    this.taskService.getTaskById(this.taskId).subscribe(
      (response) => {
        this.taskForm.patchValue(response);
      },
      (error) => {
        console.error('Failed to retrieve task details', error);
      }
    );
  }

  onUpdate(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      this.taskService.updateTask(this.taskId, taskData).subscribe(
        (response) => {
          console.log('Task updated successfully', response);
        },
        (error) => {
          console.error('Failed to update task', error);
        }
      );
      console.log('Task ID:', this.taskId); // Add this line
    } else {
      console.error('Invalid form data');
    }
  }
}
