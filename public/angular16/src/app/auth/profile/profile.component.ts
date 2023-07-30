import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  user: any; // Holds the user details

  constructor(private http: HttpClient, private authService: AuthService) { }

  ngOnInit(): void {
    // Fetch the user details using the stored token
    const token = localStorage.getItem('token');
    if (token) {
      this.authService.getUserProfile(token).subscribe(
        (response) => {
          this.user = response;
          console.log(response);
        },
        (error) => {
          console.error('Error fetching user profile:', error);
        }
      );
    }
  }
}
