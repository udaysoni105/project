import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { User } from './user';
import { HttpHeaders, HttpClient } from '@angular/common/http';

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
  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');
    
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: 'email',
      Permission: 'view_project' // Add the Permission header with the desired value
    });

    // Make the API call with the headers
    this.authService.getAllUsers(headers).subscribe(
      (response) => {
        // Handle the response here
        console.log(response);
        this.users = response; // Assuming the API returns an array of projects
        this.loading = false; // Stop loading when the data is fetched
      },
      (error) => {
        // Handle the error here
        console.error(error);
      }
    );
  }

  onSearch(): void {
    this.table.filter(this.searchQuery, 'name', 'contains');
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



