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
      userIds:['',Validators.required]
    });
  }

  createtask(taskForm: NgForm): void {
    this.checkeusers = this.user.filter((user) => user.isChecked);
  
    if (taskForm.valid) {
      const userIds = this.checkeusers.map((user) => user.id);
      const data = { ...this.tasks, userid: userIds };
      console.log('Selected data:', data);
      console.log(userIds);
      
      const token = localStorage.getItem('token');
      const email = localStorage.getItem('email');
  
      if (token !== null && email !== null) {
        const task = this.taskForm.value;
        console.log(task);
        this.taskService.createTask(task, token, email).subscribe(
          (response) => {
            console.log('Task created successfully', response);
            this.taskForm.reset();
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Task is created' });
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
