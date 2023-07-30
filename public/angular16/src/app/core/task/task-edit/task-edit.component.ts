import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  taskId!: string;
  tasks: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
    private router:Router,
    private messageService: MessageService 
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      // completed: [false],
      project_id: ['', Validators.required],
      // user_id:['',Validators.required]
    });

    this.route.params.subscribe((params) => {
      this.taskId = params['id'];
      this.loadTaskDetails();
    });
  }

  loadTaskDetails(): void {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      taskId: this.taskId,
      Permission: 'update_tasks' // Add the Permission header with the desired value
    });

    // Make the API call with the headers and task ID
    this.taskService.gettaskById(this.taskId, headers).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
        this.tasks = response; 
        this.taskForm.patchValue(response); // Update the form with the task data
      },
      (error) => {
        // Handle the error here
        console.error(error);
      }
    );
  }

  onUpdate(): void {
    if (this.taskForm.valid) {
      const taskData = this.taskForm.value;
      const jwtToken = localStorage.getItem('token');
      const email = localStorage.getItem('email');
  
      if (!jwtToken) {
        console.error('JWT token not found in local storage. Please log in.');
        return;
      }
      
      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
        Permission: 'update_tasks' // Add the Permission header with the desired value
      });
  
      this.taskService.updateTask(this.taskId, taskData, headers).subscribe(
        (response) => {
          console.log('task updated successfully', response);
          console.log('task ID:', this.taskId);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is updated' });

          // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          },1500 );
        },
        (error) => {
          console.error('Failed to update task', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update task',
          });
        }
      );
    } else {
      console.error('Invalid form data');
    }
  }
}
