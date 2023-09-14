import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { SelectItem } from 'primeng/api';

@Component({
  selector: 'app-task-edit',
  templateUrl: './task-edit.component.html',
  styleUrls: ['./task-edit.component.scss'],
})
export class TaskEditComponent implements OnInit {
  taskForm!: FormGroup;
  taskId!: string;
  tasks: any[] = [];
  loading: boolean = false;
  users: SelectItem[] = [];
  projectOptions: SelectItem[] = [];
  taskData: any; 
  assignedUsers: any[] = []; 

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private route: ActivatedRoute,
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
      user_id: [[]]
    });

    this.route.params.subscribe((params) => {
      this.taskId = params['id'];
      this.loadTaskDetails();
    });
    this.route.data.subscribe((data: any) => {
      if (data['taskAndUsers']) {
        const { taskDetails, users } = data['taskAndUsers'];
        this.taskForm.patchValue(taskDetails);
        this.taskData = taskDetails;    
        this.route.data.subscribe((data: any) => {
          if (data['taskAndUsers']) { 
            const { taskDetails, users } = data['taskAndUsers'];
            this.taskForm.patchValue(taskDetails);
            this.taskForm.patchValue(users);
            this.taskData = taskDetails;
            this.assignedUsers = users;
            this.users = users.map((user: any) => ({
              label: user.name,
              value: user.id
            }));
            this.loading = false;
          }
        });
        this.assignedUsers = users;
        this.users = users.map((user: any) => ({
          label: user.name,
          value: user.id
        }));

        this.loading = false;
      }
    });

    this.fetchProjects();
    this.fetchUsers();
  }

  loadTaskDetails(): void {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      taskId: this.taskId,
      Permission: 'update_tasks' 
    });

      this.taskService.gettaskById(this.taskId,headers).subscribe(
        (response) => {
          if (response) {
            this.taskForm.patchValue(response);
            
            // Assuming the assigned users are in response.users
            this.assignedUsers = response.users;
            
            // Populate the user selection in the form
            this.taskForm.get('user_id')?.setValue(this.assignedUsers.map((user: any) => user.id));
          }
    
          this.loading = false;
        },
      (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false;

        if (error.status === 404) {
          this.router.navigate(['temporary-error']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
          this.router.navigate(['temporary-error']);
        }

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 5000); // 5 seconds delay
      }
    );
  }
  
  fetchProjects(): void {
    this.taskService.getProjects().subscribe(
      (projects) => {

        this.projectOptions = projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));

      }, (error) => {
        console.log('Soft delete failed:', error);
        this.loading = false;

        if (error.status === 404) {
          this.router.navigate(['temporary-error']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to softDelete project',
          });
          this.router.navigate(['temporary-error']);
        }

        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 5000); 
      }
    );
  }  

  fetchUsers(): void {
    this.loading = true;
    this.taskService.getUsers().subscribe(
      (users) => {
        // console.log(users);
        this.users = users.map((user: any) => ({
          label: user.name,
          value: user.id, // Adjust this based on your actual user data structure
        }));
        // console.log(this.users);
        this.loading = false; // Stop loading when the data is fetched
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

  onUpdate(): void {
    this.loading = true;
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
      const task = this.taskForm.value;

      task.user_id = Array.isArray(task.user_id) ? task.user_id : [task.user_id];

      this.taskService.updateTask(this.taskId, taskData, headers).subscribe(
        (response) => {

          this.loading = false; // Stop loading when the data is fetched
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is updated' });

          // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
          setTimeout(() => {
            this.router.navigate(['/tasks']);
          }, 1500);
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

  cancel() {
    // You can add logic here to navigate to a different page or reset the form
    this.router.navigate(['/tasks']); // Navigate to another page
    // Or reset the form, if needed
    this.taskForm.reset();
  }
}
