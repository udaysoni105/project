import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss']
})
export class TaskCreateComponent {
  // tasks: any[] = [];
  taskForm!: FormGroup; // Add "!" to indicate it will be assigned later
  tasks: any[] = [
    {
      name: '',
      description: '',
      start_date: '',
      end_date: '',
      status: '',
    },
  ];

  constructor(private formBuilder: FormBuilder,private taskService: TaskService) {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_completed: [false]
    });
  }

  registerTask(): void {
    const task = this.taskForm.value;
    this.taskService.createTask(task).subscribe(
      (response) => {
        console.log('Task registered successfully', response);
      },
      (error) => {
        console.error('Failed to register task', error);
      }
    );
  }
}
