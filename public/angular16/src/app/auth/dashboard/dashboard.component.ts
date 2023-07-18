import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  tableToShow: string = ''; // Variable to track the table to display

  getStartedClickCount: number = 0; // Variable to track the number of button clicks
  constructor(private authService: AuthService,private router: Router,private route: ActivatedRoute) {}
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
  handleGetStartedClick() {
    this.getStartedClickCount++;

    if (this.getStartedClickCount === 1) {
      this.tableToShow = 'projects';
      this.router.navigateByUrl('/projects'); // Navigate to the users page
    } else if (this.getStartedClickCount === 2) {
      this.tableToShow = 'tasks';
      this.router.navigateByUrl('/tasks'); // Navigate to the users page
    } else if (this.getStartedClickCount === 3) {
      this.tableToShow = 'users';
      this.router.navigateByUrl('/users'); // Navigate to the users page
    }
  }
}





