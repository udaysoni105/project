import { Component, OnInit, ViewChild } from '@angular/core';
import { AuthService } from '../auth.service';
import { Table } from 'primeng/table';
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
    private router: Router) { }

  ngOnInit() {
    this.loadUsers();
  }

  displayNA(value: any): string {
    return value !== null && value !== undefined ? value : 'N.A';
  }

  /** 
* @author : UDAY SONI
* Method name: loadUsers
* Add the Permission header with the desired value
* Make the API call with the headers
* Assuming the API returns an array of projects
* Stop loading when the data is fetched
* 
*/
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
      'email': `${email}`,
      Permission: 'update_tasks'
    });

    this.authService.getAllUsers(headers).subscribe(
      (response) => {
        console.log(response);

        if (response !== null && response !== undefined) {
          this.users = response;
          this.loading = false;
        }
        else {
          if (response === 404) {
            this.router.navigate(['/404']);
          } else if (response === 401) {
            // Handle 401 error - navigate to a 401 page
            this.router.navigate(['/401']);
          } else {{
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'user not found',
            });
            this.router.navigate(['401']);
          }
          // this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'users data not show' });
          // setTimeout(() => {
          //   this.router.navigate(['/login']);
          // }, 1500);
        }
      }},
      (error) => {
        // console.log(error);
        this.loading = false;
        if (error.status === 404) {
          this.router.navigate(['/404']);
        } else if (error.status === 401) {
          // Handle 401 error - navigate to a 401 page
          this.router.navigate(['/401']);
        } else {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'user not found',
          });
          this.router.navigate(['401']);
        }
      }
    );
  }

  /** 
* @author : UDAY SONI
* Method name: onSearch
* Extract the 'data' array from the response
*/
  onSearch(): void {
    const jwtToken = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      'email': `${email}`,
    });
    this.authService.searchTasks(this.searchQuery, headers).subscribe(
      (response) => {
        if (response !== null && response !== "") {
          this.users = response.data;
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully' });
          setTimeout(() => {
          }, 1500);
        }
      },
      (error) => {
      }
    );
  }
}



