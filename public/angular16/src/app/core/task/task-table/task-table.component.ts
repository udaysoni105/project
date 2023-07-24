import { Component, OnInit, ViewChild } from '@angular/core';
import { TaskService } from '../task.service';
import { Table } from 'primeng/table';
import { Router } from '@angular/router';
import { Token } from '@angular/compiler';
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
      email: 'email',
      Permission: 'view_tasks', // Add the Permission header with the desired value
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
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      Permission: 'delete_tasks', // Add the Permission header with the desired value
    });

    this.taskService.deletetask(id, headers).subscribe(
      (response) => {
        console.log('Project hard deleted successfully');
        this.loadTasks();
        this.tasks = this.tasks.filter((task) => task.id !== id);
      },
      (error) => {
        console.log('Soft delete failed:', error);
      }
    );
  }

  onSearch(): void {
    this.table.filter(this.searchQuery, 'name', 'contains');
  }
}
