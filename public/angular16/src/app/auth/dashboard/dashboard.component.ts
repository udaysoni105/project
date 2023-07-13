import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  constructor(private authService: AuthService,private router: Router) {}
  logout(): void {
    this.authService.logout().subscribe(
      response => {
        console.log('Logout successful', response);
        // Handle successful logout
        this.router.navigate(['login'])
      },
      error => {
        console.error('Logout failed', error);
        // Handle logout error
      }
    );
  }
}
