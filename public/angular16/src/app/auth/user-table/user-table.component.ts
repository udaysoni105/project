import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Table } from 'primeng/table';
import { SortEvent } from 'primeng/api';
import { User } from './user';
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



  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.authService.getAllUsers().subscribe(
      data => {
        this.users = data;
      },
      error => {
        console.log(error);
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



