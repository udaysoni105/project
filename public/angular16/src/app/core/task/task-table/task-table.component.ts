import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';

@Component({
  selector: 'app-task-table',
  templateUrl: './task-table.component.html',
  styleUrls: ['./task-table.component.scss'],
})
export class TaskTableComponent implements OnInit {
  tasks: any[] = [];

  searchQuery: string = '';
  @ViewChild('table') table!: Table;

  constructor(private taskService: TaskService, private router: Router) {}

  ngOnInit() {
    this.loadTasks();
  }
  //   ngOnInit(): void {
  //     this.loadTasks();
  //     // this.taskService.getTasks().subscribe(
  //     //   (response) => {
  //     //     this.tasks = response;
  //     //     console.log('Headers:', response.headers);
  //     //   },
  //     //   (error) => {
  //     //     console.error(error);
  //     //   }
  //     // );
  //   }

  loadTasks() {
    this.taskService.getAllTasks().subscribe(
      (data) => {
        this.tasks = data;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  deleteTask(id: string) {
    this.taskService.deletetask(id).subscribe(
      () => {
        this.loadTasks();
      },
      (error) => {
        console.log(error);
      }
    );
  }  

  onSearch(): void {
    this.table.filter(this.searchQuery, 'name', 'contains');
  }

  // checkPermission(permission: string): boolean {
  //   // Return true or false based on the permission check
  //   return true; // Replace with your implementation
  // }

  // editTask(taskId: number): void {
  //   // Logic to edit the task with the given taskId

  //   // Option 1: Navigate to a task editing page
  //   this.router.navigate(['edit']);
  // }
}
