import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { DatePipe } from '@angular/common';
import { Output, EventEmitter ,Input} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-task-create',
  templateUrl: './task-create.component.html',
  styleUrls: ['./task-create.component.scss'],
})
export class TaskCreateComponent implements OnInit {
  taskForm!: FormGroup; 
  projects: any[] = [];
  user:any[]=[];
  checkeusers: any[] = [];
  @Output() userSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedProject: any;
  visible: boolean = false;
  selectedUserIds: number[] = [];
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
    private messageService: MessageService ,
    private route: ActivatedRoute,
  ) {
  }
  
    ngOnInit(): void {
      this.taskForm = this.formBuilder.group({
        name: ['', Validators.required],
        description: [''],
        start_date: ['', Validators.required],
        end_date: ['', Validators.required],
        project_id: ['', Validators.required],
        // userIds:['',Validators.required]
      });
      this.fetchUsers(); // Fetch users data during component initialization
    }
  
    fetchUsers() {
      // Assuming you have a service method to fetch users, like 'getUserList()'
      // Modify it accordingly to match your implementation.
      this.taskService.getUserList().subscribe(
        (users) => {
          this.user = users;
        },
        (error) => {
          console.error('Error fetching users:', error);
        }
      );
    }
  
    onUserCheckboxChange(user: any) {
      const index = this.selectedUserIds.indexOf(user.id);
      if (index === -1) {
        this.selectedUserIds.push(user.id);
      } else {
        this.selectedUserIds.splice(index, 1);
      }
    }
    
  // createtask(taskForm: NgForm): void {
  //   this.checkeusers = this.user.filter((user) => user.isChecked);
  
  //   if (taskForm.valid) {
  //     const taskData = { ...this.taskForm.value, userIds: this.selectedUserIds };
  //     console.log('Task data:', taskData);
  //     const userIds = this.checkeusers.map((user) => user.id);
  //     const data = { ...this.tasks, userid: userIds };
  //     console.log('Selected data:', data);
  //     console.log(userIds);
      
  //     const token = localStorage.getItem('token');
  //     const email = localStorage.getItem('email');
  
  //     if (token !== null && email !== null) {
  //       const task = this.taskForm.value;
  //       console.log(task);
  //       this.taskService.createTask(task, token, email).subscribe(
  //         (response) => {
  //           console.log('Task created successfully', response);
  //           this.taskForm.reset();
  //           this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });
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
  
  showDialog() {
    this.visible = true;
  }
  onCancel() {
    this.router.navigate(['/task-Create']);
  }
  onuserSelected(checkeusers: any) {
    this.userSelected.emit(checkeusers);
  }  
}
// import { Component, OnInit } from '@angular/core';
// import { FormGroup, FormBuilder, Validators } from '@angular/forms';
// import { TaskService } from '../task.service';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Router } from '@angular/router';
// import { MessageService } from 'primeng/api';
// @Component({
//   selector: 'app-task-create',
//   templateUrl: './task-create.component.html',
//   styleUrls: ['./task-create.component.scss'],
// })
// export class TaskCreateComponent implements OnInit {
//   taskForm!: FormGroup; // Add "!" to indicate it will be assigned later
//   tasks: any[] = [
//     {
//       name: '',
//       description: '',
//       start_date: '',
//       end_date: '',
//       status: '',
//     },
//   ];

//   constructor(
//     private formBuilder: FormBuilder,
//     private taskService: TaskService,
//     private router: Router,
//     private messageService: MessageService 
//   ) {
//     this.taskForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       description: [''],
//       start_date: ['', Validators.required],
//       end_date: ['', Validators.required],
//       is_completed: [false],
//     });
//   }

//   ngOnInit(): void {
//     this.taskForm = this.formBuilder.group({
//       name: ['', Validators.required],
//       description: [''],
//       start_date: ['', Validators.required],
//       end_date: ['', Validators.required],
//       is_completed: [true],
//       project_id: ['', Validators.required],
//     });
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
//         this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });

//         // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
//         setTimeout(() => {
//           this.router.navigate(['/tasks']);
//         },1500 );
//       },
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