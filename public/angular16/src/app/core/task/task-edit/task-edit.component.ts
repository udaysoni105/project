import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpHeaders } from '@angular/common/http';
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
  today: string = new Date().toISOString().split('T')[0];
  start_date: any;
  end_date: any;
  projectStartDate: any;
  projectEndDate: any;

  constructor(
    private fb: FormBuilder,
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

  /** 
* @author : UDAY SONI
* Method name: loadTaskDetails
* Assuming the assigned users are in response.users
* Populate the user selection in the form
* 
*/
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
      'email': `${email}`,
      taskId: this.taskId,
      Permission: 'update_tasks'
    });

    this.taskService.gettaskById(this.taskId, headers).subscribe(
      (response) => {
        if (response) {
          if (response) {
            this.projectStartDate = response.start_date;
            this.projectEndDate = response.end_date;
          }
          this.taskForm.patchValue(response);
          this.assignedUsers = response.users;
          this.taskForm.get('user_id')?.setValue(this.assignedUsers.map((user: any) => user.id));
        }
        this.loading = false;
      },
      (error) => {
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

  /** 
* @author : UDAY SONI
* Method name: fetchProjects
*/
  fetchProjects(): void {
    this.taskService.getProjects().subscribe(
      (projects) => {

        this.projectOptions = projects.map((project) => ({
          label: project.name,
          value: project.id,
        }));
      }, (error) => {
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

  /** 
* @author : UDAY SONI
* Method name: fetchUsers
*/
  fetchUsers(): void {
    this.loading = true;
    this.taskService.getUsers().subscribe(
      (users) => {
        this.users = users.map((user: any) => ({
          label: user.name,
          value: user.id,
        }));
        this.loading = false;
      },
      (error) => {
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
        }, 5000);
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: onUpdate
* Stop loading when the data is fetched
*/
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
        'email': `${email}`,
        Permission: 'update_tasks'
      });
      const task = this.taskForm.value;
      task.user_id = Array.isArray(task.user_id) ? task.user_id : [task.user_id];
      this.taskService.updateTask(this.taskId, taskData, headers).subscribe(
        (response) => {
          this.loading = false;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is updated' });
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

  /** 
* @author : UDAY SONI
* Method name: cancel
*/
  cancel() {
    this.router.navigate(['/tasks']);
    this.taskForm.reset();
  }
}
