import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
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

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private messageService: MessageService 
  ) {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_completed: [false],
    });
  }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      is_completed: [true],
      project_id: ['', Validators.required],
    });
  }

  createtask(): void {
    console.log(this.taskForm);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      const task = this.taskForm.value;
      this.taskService.createTask(this.taskForm.value, token, email).subscribe(
        (response) => {
          console.log('Task created successfully', response);
          // Reset the form
          this.taskForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => {
          this.router.navigate(['/tasks']);
        },1500 );
      },
        (error) => {
          console.error('Failed to create task', error);
        }
      );
    }
  }
}
