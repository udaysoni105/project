import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup;
  projects: SelectItem[] = [];
  users: SelectItem[] = [];
  projectOptions: SelectItem[] = [];
  loading: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      project_id: ['', Validators.required],
      user_id: [[], Validators.required]
    });

    this.fetchProjects();
    this.fetchUsers();
  }

  fetchProjects(): void {
    this.taskService.getProjects().subscribe(
      (projects) => {
        this.projectOptions = projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      }  , (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false;
      
        if (error.status === 404) {
          this.router.navigate(['Not Found']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
          this.router.navigate(['Not Found']);
        }
      
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 5000); // 5 seconds delay
      }
    );
  }

  fetchUsers(): void {
    this.taskService.getUsers().subscribe(
      (users) => {
        this.users = users.map((user: any) => ({
          label: user.name,
          value: user.id, // Adjust this based on your actual user data structure
        }));
      },
      (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false;
      
        if (error.status === 404) {
          this.router.navigate(['Not Found']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
          this.router.navigate(['Not Found']);
        }
      
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 5000); // 5 seconds delay
      }
    );
  }

  createtask(): void {
    this.loading = true;
    console.log(this.taskForm);
  
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');
  
    if (token !== null && email !== null) {
      const task = this.taskForm.value;
  
 // Convert user_id to an array if it's not already
 task.user_id = Array.isArray(task.user_id) ? task.user_id : [task.user_id];
  
      this.taskService.createTask(task, token, email).subscribe(
        (response) => {
          console.log('Task created successfully', response);
          // Reset the form
          this.taskForm.reset();
          this.loading = false; // Stop loading when the data is fetched
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });
  
          // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1500);
        },
        (error) => {
          console.error('Failed to create task', error);
          this.loading = false; // Stop loading when the data is fetched
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create task',
          });
        }
      );
    }
  }
  
}
