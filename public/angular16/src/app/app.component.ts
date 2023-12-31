import { Component, OnInit } from '@angular/core';
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
export class AppComponent implements OnInit {
  'title' = 'project management system';
  isLoading: boolean = true;
  token: string | null = localStorage.getItem('token');
  items: MenuItem[] = [];
  activeItem: MenuItem = {};
  shouldShowMenu: boolean = true;

  constructor(
    private appService: AppService,
    private router: Router,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
      email: 'email',
    });
    if (!token) {
      this.shouldShowMenu = false;
    } else {
      this.shouldShowMenu = true;
      this.items = [
        { label: 'Home', routerLink: '/', icon: 'pi pi-fw pi-home' },
        { label: 'Projects', routerLink: '/projects', icon: 'pi pi-fw pi-calendar' },
        { label: 'Tasks', routerLink: '/tasks', icon: 'pi pi-fw pi-pencil' },
        { label: 'Team', routerLink: '/users', icon: 'pi pi-fw pi-file' },
        { label: 'Logout', icon: 'pi pi-fw pi-cog', command: () => { this.logout(); } },
        { label: 'Profile', routerLink: '/profile', icon: 'pi pi-fw pi-user' },
      ];
      this.activeItem = this.items[0];
    }
  }

  logout(): void {
    this.appService.logout().subscribe(
      () => {
        localStorage.removeItem('token');
        window.location.reload()
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'logout successfully' });
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
        setTimeout(() => {
        }, 1500);
      });
  }
}
