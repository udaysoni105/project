// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { TaskService } from '../task.service';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { MessageService } from 'primeng/api';
// import { Project } from '../../project/project';
// import { SelectItem } from 'primeng/api';
// @Component({
//   selector: 'app-task-create',
//   templateUrl: './task-create.component.html',
//   styleUrls: ['./task-create.component.scss'],
// })
// export class TaskCreateComponent implements OnInit {
//   taskForm!: FormGroup; // Add "!" to indicate it will be assigned later
//   // task:any[]=[];
//   task: any = {};
//   projects: any[] = [];
//   users: any[] = [];
//   Project_id: Project[] = [];
//   projectOptions: SelectItem[] = [];
//   user: any[] = [];

//   constructor(
//     private formBuilder: FormBuilder,
//     private taskService: TaskService,
//     private router: Router,
//     private messageService: MessageService
//   ) {
//   }

//   ngOnInit(): void {
//     this.taskForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       description: [''],
//       start_date: ['', Validators.required],
//       end_date: ['', Validators.required],
//       project_id: ['', Validators.required],
//       user_id: ['', Validators.required]
//     });
//     this.fetchProjects();
//     this.fetchUsers();
//   }

//   projectcreate(selectedProjectId: any): void {
//     console.log('Selected Project ID:', selectedProjectId);
//     this.taskService.projectcreate().subscribe(
//       (response: any) => {
//         console.log('API Response:', response);
//         if (Array.isArray(response.project_id)) {
//           this.projects = response.project_id;
//           this.projectOptions = this.projects.map((project_id: Project) => ({
//             label: project_id.name,
//             value: project_id,
//           }));
//           console.log('project_id:', this.projects);
//         } else {
//           console.error('Error: project_id data is not an array');
//         }
//       },
//       (error) => {
//         console.error('Error fetching project_id:', error);
//       }
//     );
//   }

//   createtask(): void {
//     console.log(this.taskForm);

//     const token = localStorage.getItem('token');
//     const email = localStorage.getItem('email');

//     if (token !== null && email !== null) {
//       const task = this.taskForm.value;
//       this.taskService.createTask(this.taskForm.value, token, email).subscribe(
//         (response) => {
//           console.log('Task created successfully', response);
//           // Reset the form
//           this.taskForm.reset();
//           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });

//           // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
//           setTimeout(() => {
//             this.router.navigate(['/tasks']);
//           }, 1500);
//         },
//         (error) => {
//           console.error('Failed to create task', error);
//           this.messageService.add({
//             severity: 'error',
//             summary: 'Error',
//             detail: 'Failed to create task',
//           });
//         }
//       );
//     }
//   }
//   fetchProjects() {
//     const token = localStorage.getItem('token');
//     const email = localStorage.getItem('email');

//     if (token !== null && email !== null) {
//       const task = this.taskForm.value;
//     this.taskService.getProjects().subscribe(
//       (projects) => {
//         this.projectOptions = projects.map((project) => ({
//           label: project.name,
//           value: project.id,
//         }));
//       },
//       (error) => {
//         console.error('Error fetching projects:', error);
//       }
//     );
//   }
// }
//   fetchUsers() {
//         const token = localStorage.getItem('token');
//     const email = localStorage.getItem('email');

//     if (token !== null && email !== null) {
//       const task = this.taskForm.value;
//     this.taskService.getUsers().subscribe(
//       (users) => {
//         this.users = users.map((user: { name: any; }) => ({
//           label: user.name,
//           value: user.name, // Adjust this based on your actual user data structure
//         }));
//       },
//       (error) => {
//         console.error('Error fetching users:', error);
//       }
//     );
//   }  
// }
// }
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

  constructor(
    private formBuilder: FormBuilder,
    private taskService: TaskService,
    private router: Router,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.taskForm = this.formBuilder.group({
      name: ['', Validators.required],
      description: [''],
      start_date: ['', Validators.required],
      end_date: ['', Validators.required],
      project_id: ['', Validators.required],
      user_id: ['', Validators.required]
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
      },
      (error) => {
        console.error('Error fetching projects:', error);
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
        console.error('Error fetching users:', error);
      }
    );
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
          }, 1500);
        },
        (error) => {
          console.error('Failed to create task', error);
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
