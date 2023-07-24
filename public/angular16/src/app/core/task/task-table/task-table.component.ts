import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // loadTasks() {
  //   this.taskService.getAllTasks().subscribe(
  //     (data) => {
  //       this.tasks = data;
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // }
      // Method to fetch projects from the API
      loadTasks() {
        const jwtToken = localStorage.getItem('token');
        const email = localStorage.getItem('email');
        if (!jwtToken) {
          console.error('JWT token not found in local storage. Please log in.');
          return;
        }
      
        const headers = new HttpHeaders({
          Authorization: `Bearer ${jwtToken}`,
          email :'email',
          Permission: 'view_project' // Add the Permission header with the desired value
        });
      
        // Make the API call with the headers
        this.taskService.getAllTasks(headers).subscribe(
          (response) => {
            // Handle the response here
            console.log(response);
            this.tasks = response; // Assuming the API returns an array of projects
          },
          (error) => {
            // Handle the error here
            console.error(error);
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
