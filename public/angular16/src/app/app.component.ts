import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { AppService } from './app.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  'title' = 'project management system';
  isLoading: boolean = true;
  items: MenuItem[] = []; // Initialize items as an empty array
  token: string | null = localStorage.getItem('token'); 

  shouldShowMenu: boolean = true;
  ngOnInit() {
    // Check if a token exists in local storage
    const token = localStorage.getItem('token');
    // console.log(token);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      email: 'email',
    });
    // console.log(headers);
    if (!token) {
      this.shouldShowMenu = false; // If no token, hide the menu
    } else {
      // If a token exists, populate the menu items
      this.shouldShowMenu = true; // If no token, hide the menu
      this.items = [
        { label: 'Home', routerLink: '/', icon: 'pi pi-fw pi-home' },
        { label: 'Projects', routerLink: '/projects', icon: 'pi pi-fw pi-calendar' },
        { label: 'Tasks', routerLink: '/tasks', icon: 'pi pi-fw pi-pencil' },
        { label: 'Team', routerLink: '/users', icon: 'pi pi-fw pi-file' },
        // { label: 'Logout', routerLink: '/home', icon: 'pi pi-fw pi-cog' },
        { label: 'Logout', icon: 'pi pi-fw pi-cog', command: () => this.logout() }, 
        { label: 'Profile', routerLink: '/profile', icon: 'pi pi-fw pi-user' },
      ];
    }
  }

  constructor(
    private appService: AppService, // Replace AuthService with your authentication service
    private router: Router,
    private messageService: MessageService
  ) {}

  logout(): void { 
    this.appService.logout().subscribe(
      () => { localStorage.removeItem('token'); 
      // this.router.navigate(['/login']); 
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'logout successfully' });
console.log("success");
      // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 1500);
    }, 
    (error: any) => { 
      console.error('Logout error:', error); 
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to logout',
      });
    }); 
  }
}
