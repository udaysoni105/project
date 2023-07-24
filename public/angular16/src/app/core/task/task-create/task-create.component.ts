import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { TaskService } from '../task.service';
import { Router } from '@angular/router';
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
    private router: Router
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

  // registerTask(): void {
  //   if (this.taskForm.invalid) {
  //     return;
  //   }

  //   const task = this.taskForm.value;
  //   this.taskService.createTask(task).subscribe(
  //     (response) => {
  //       console.log('Task registered successfully', response);
  //       // Reset the form
  //       this.taskForm.reset();
  //       this.router.navigate(['/tasks']);
  //     },
  //     (error) => {
  //       console.error('Failed to register task', error);
  //     }
  //   );
  // }


  registerTask() {
    console.log(this.taskForm);

    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (token !== null && email !== null) {
      this.taskService.createTask(this.taskForm, token, email).subscribe(
        (response) => {
          console.log('product created:', response);
          this.router.navigate(['/tasks']);
        },
        (error) => {
          console.error('Failed to create product:', error);
        }
      );
    }
  }
  
}

