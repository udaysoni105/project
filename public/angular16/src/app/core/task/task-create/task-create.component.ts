// import { Component, OnInit } from '@angular/core';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { TaskService } from '../task.service';
// import { MessageService } from 'primeng/api';
// import { Router } from '@angular/router';

// @Component({
//   selector: 'app-task-create',
//   templateUrl: './task-create.component.html',
//   styleUrls: ['./task-create.component.scss'],
// })
// export class TaskCreateComponent implements OnInit {
//   taskForm!: FormGroup;
//   projects: any[] = [];
//   users: any[] = [];

//   constructor(
//     private formBuilder: FormBuilder,
//     private taskService: TaskService,
//     private router: Router,
//     private messageService: MessageService,
//   ) {}

//   ngOnInit(): void {
//     this.getProjects();
//     this.getUsers();

//     this.taskForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       description: [''],
//       start_date: ['', Validators.required],
//       end_date: ['', Validators.required],
//       project_id: ['', Validators.required],
//       user_id: ['', Validators.required], // Use an array to hold multiple user IDs
//     });
//   }

//   getProjects() {
//     // Call the TaskService to fetch projects
//     this.taskService.getProjects().subscribe(
//       (projects) => {
//         this.projects = projects;
//       },
//       (error) => {
//         console.error('Error fetching projects:', error);
//       }
//     );
//   }

//   getUsers() {
//     // Call the TaskService to fetch users
//     this.taskService.getUsers().subscribe(
//       (users) => {
//         this.users = users;
//       },
//       (error) => {
//         console.error('Error fetching users:', error);
//       }
//     );
//   }

//   createtask(): void {
//     console.log(this.taskForm.value);

//     const token = localStorage.getItem('token');
//     const email = localStorage.getItem('email');

//     if (token !== null && email !== null) {
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
// }
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
  projects : any[]=[];
  users : any[]=[];
  
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
      end_date: ['', Validators.required]
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