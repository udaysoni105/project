import { Component } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MenuItem } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  tableToShow: string = ''; // Variable to track the table to display
  items: MenuItem[] = []; // Initialize items as an empty array
  getStartedClickCount: number = 0; // Variable to track the number of button clicks

  constructor(private authService: AuthService, private router: Router, private route: ActivatedRoute) { }

  ngOnInit() {
    this.items = [
      { label: 'Home', routerLink: '/', icon: 'pi pi-fw pi-home' },
      { label: 'Projects', routerLink: '/projects', icon: 'pi pi-fw pi-calendar' },
      { label: 'Tasks', routerLink: '/tasks', icon: 'pi pi-fw pi-pencil' },
      { label: 'Team', routerLink: '/users', icon: 'pi pi-fw pi-file' },
      { label: 'Logout', routerLink: '/home', icon: 'pi pi-fw pi-cog' },
      { label: 'profile', routerLink: '/profile', icon: 'pi pi-fw pi-user', }
    ];
  }

  logout(): void { 
    this.authService.logout().subscribe(
      () => { localStorage.removeItem('token'); 
      this.router.navigate(['/login']); 
    }, 
    (error: any) => { 
      console.error('Logout error:', error); 
    }); 
  }

  handleGetStartedClick() {
    this.getStartedClickCount++;

    if (this.getStartedClickCount === 1) {
      this.tableToShow = 'tasks';
      this.router.navigateByUrl('/tasks'); // Navigate to the users page
    } else if (this.getStartedClickCount === 2) {
      this.tableToShow = 'projects';
      this.router.navigateByUrl('/projects'); // Navigate to the users page
    } else if (this.getStartedClickCount === 3) {
      this.tableToShow = 'users';
      this.router.navigateByUrl('/users'); // Navigate to the users page
    }
  }
}





