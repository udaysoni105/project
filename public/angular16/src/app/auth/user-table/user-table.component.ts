import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { User } from './user';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss']
})

export class UserTableComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  searchValue = '';
  searchQuery: string = '';
  @ViewChild('table') table!: Table;

  loading: boolean = false;
  constructor(private authService: AuthService,    
    private messageService: MessageService,
    private router:Router) { }

  ngOnInit() {
    this.loadUsers();
  }

  displayNA(value: any): string {
    return value !== null && value !== undefined ? value : 'N.A';
  }

  loadUsers() {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    // console.log(jwtToken);
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: 'email',
      Permission: 'view_project' // Add the Permission header with the desired value
    });
    // console.log(headers);

    // Make the API call with the headers
    this.authService.getAllUsers(headers).subscribe(
      (response) => {
        // Handle the response here
        // console.log(response);
        this.users = response; // Assuming the API returns an array of projects
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

  // onSearch(): void {
  //   this.table.filter(this.searchQuery, 'name', 'contains');
  // }
  onSearch(): void {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    // console.log(jwtToken);
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: 'email'
    });
// console.log(headers);

    this.authService.searchTasks(this.searchQuery, headers).subscribe(
      (response) => {
        // console.log('Search Response:', response);
        this.users = response.data; // Extract the 'data' array from the response
      },
      (error) => {
        console.log(error);
      }
    );
  }

  // onSearch(): void {
  //   if (this.searchValue.trim() !== '') {
  //     this.filteredUsers = this.users.filter(user => {
  //       return (
  //         user.name.toLowerCase().includes(this.searchValue.toLowerCase()) ||
  //         user.email.toLowerCase().includes(this.searchValue.toLowerCase()) ||
  //         user.country.toLowerCase().includes(this.searchValue.toLowerCase()) ||
  //         user.state.toLowerCase().includes(this.searchValue.toLowerCase())
  //       );
  //     });
  //   } else {
  //     this.filteredUsers = [...this.users];
  //   }
  // }

  onSort(event: SortEvent): void {
    // Implement the sorting logic here
  }
}



