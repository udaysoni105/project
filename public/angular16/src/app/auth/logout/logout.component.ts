import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss']
})
export class LogoutComponent {
  constructor(private http: HttpClient,private authService: AuthService,private router: Router) {}

  logout(): void {
    this.authService.logout().subscribe(
      response => {
        console.log('Logout successful', response);
        // Handle successful logout
        this.router.navigate(['home'])
      },
      error => {
        console.error('Logout failed', error);
        // Handle logout error
      }
    );
  }
}
