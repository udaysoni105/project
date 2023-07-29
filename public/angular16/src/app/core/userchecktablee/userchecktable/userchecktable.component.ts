import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { UserchecktableService } from '../userchecktable.service';
import { DialogService } from 'primeng/dynamicdialog';
import { HttpHeaders } from '@angular/common/http'; 

@Component({
  selector: 'app-userchecktable',
  templateUrl: './userchecktable.component.html',
  styleUrls: ['./userchecktable.component.scss'],
  providers: [DialogService]
})
export class UserchecktableComponent implements OnInit {
  user: any[] = [];
  visible: boolean = false;
  checkeusers: any[] = [];

  @Output() userSelected: EventEmitter<any> = new EventEmitter<any>();
  @Input() selectedUser: any;

  constructor(private userchecktableService: UserchecktableService, private dialogService: DialogService) {}

  ngOnInit(): void {
    const jwtToken = localStorage.getItem('token')!;
    const email = localStorage.getItem('email')!;
    
    if (!jwtToken) {
      console.error('JWT token not found in local storage. Please log in.');
      return;
    }
    
    const headers = new HttpHeaders({
      Authorization: `Bearer ${jwtToken}`,
      email: email,
      Permission: 'view_project',
    });

    this.getUserList(headers);
    this.fetchUsers(headers);
  }

  fetchUsers(headers: HttpHeaders) {
    const url = 'http://127.0.0.1:8000/api/users';

    // Fetch users using the UserService with headers
    this.userchecktableService.getUser(headers).subscribe(
      (data) => {
        this.user = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  showDialog() {
    this.visible = true;
  }

  getUserList(headers: HttpHeaders): void {
    // Get the list of users using the UserService
    this.userchecktableService.getUser(headers).subscribe(
      (response: any) => {
        this.user = response;
      },
      (error: any) => {
        console.error('Error getting users:', error);
      }
    );
  }

  onSubmit() {
    // Filter the checked users
    this.checkeusers = this.user.filter((user) => user.isChecked);

    if (!this.selectedUser) {
      return this.selectedUser;
    }

    // Open a dialog using the DialogService
    const ref = this.dialogService.open(UserchecktableComponent, {
      header: 'Selected User',
      width: '70%',
      contentStyle: { 'max-height': '500px', overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        user: this.selectedUser
      }
    });
  }
}
