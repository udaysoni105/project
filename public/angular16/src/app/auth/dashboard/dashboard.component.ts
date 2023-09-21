import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tableToShow: string = '';
  getStartedClickCount: number = 0;

  constructor(private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService) { }

  ngOnInit() {
    // Check if the flag is not set in localStorage
    if (!localStorage.getItem('dashboardRefreshed')) {
      // Perform a one-time refresh
      window.location.reload();
      // Set the flag in localStorage to indicate that the refresh has occurred
      localStorage.setItem('dashboardRefreshed', 'true');
    }
  }

  /** 
  * @author : UDAY SONI
  * Method name: handleGetStartedClick
  * if click handleGetStartedClick show task table.
  * if success show message success else error message show 
  * message show using primeng Toast use 
  * 1.5 second message showing time
  */
  handleGetStartedClick() {
    this.getStartedClickCount++;
    if (this.getStartedClickCount === 1) {
      this.messageService.add({ severity: 'success', summary: 'Success', detail: 'task table open successfully' });
      setTimeout(() => {
        this.router.navigate(['/tasks']);
      }, 1500);
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Failed to task table open',
      });
      setTimeout(() => {
        this.router.navigate(['/tasks']);
      }, 1500);
    }
  }
}
