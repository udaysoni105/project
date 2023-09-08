import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  emailForm!: FormGroup;
  email: string = '';
  isRequestSent: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink() {
    if (this.emailForm.invalid) {
      return;
    }
  
    const formData = this.emailForm.value;
    this.email = formData.email; 
  console.log(this.email);
    this.authservice.sendPasswordResetLink(this.email).subscribe(
      (response) => {
        console.log('Password reset request sent:', response);
        this.isRequestSent = true;
        // this.users = { email: '', password: '' };
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'login successfully' });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
        // this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error sending password reset request:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'user is not associated'
        });
        setTimeout(() => {
        }, 1500);
      }
    );
  }
  
}
