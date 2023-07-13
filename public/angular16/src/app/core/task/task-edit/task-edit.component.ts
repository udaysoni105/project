import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss']
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  tasks: any[] = []; // Array to store tasks

  constructor(private formBuilder: FormBuilder, private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_completed: [false]
    });
  }

  onUpdate(): void {
    const task = this.taskForm.value;
    const taskId = task.id; // Assuming you have an "id" field in your task object

    this.taskService.updateTask(taskId, task).subscribe(
      (response) => {
        console.log('Task updated successfully', response);
      },
      (error) => {
        console.error('Failed to update task', error);
      }
    );
  }
}
