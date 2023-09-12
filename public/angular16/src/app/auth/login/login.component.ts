import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  email!: string;
  password!: string;
  loginForm!: FormGroup;
  users: any = {};
  // public formVali
  public isInValid !: boolean;
  error: string | null = null;
  loading: boolean = false;

  constructor(private router: Router, 
    private formBuilder: FormBuilder, 
    private authService: AuthService, 
    private http: HttpClient, 
    private messageService: MessageService
    ) { localStorage.clear() }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe(
      (response: any) => {
        // console.log(response);
        const token = response.access_token;
        const role = response.user.role;
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('role', role);
        this.users = { email: '', password: '' };
        this.loading = false;
        this.loginForm.reset();
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'login successfully' });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      (error) => {
        console.error(error);
        this.loading = false;
  
        // Check the error message and display an appropriate message
        let errorMessage = 'An error occurred. Please try again.'; // Default error message
  
        if (error.status === 401) {
          errorMessage = 'Incorrect password. Please try again.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        }
  
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });
  
        setTimeout(() => {
          // Optionally, you can clear the form or take other actions here.
        }, 1500);
      }
    );
  }
  //     (error) => {
  //       console.error(error);
  //       this.loading = false;
  //       this.messageService.add({
  //         severity: 'error',
  //         summary: 'Error',
  //         detail: 'user is not associated'
  //       });
  //       setTimeout(() => {
  //       }, 1500);
  //     }
  //   );
  // }

  forgotPassword() {
    const data = {
      // email: this.email,
    };

    this.http.post('/forgot-password', data).subscribe(
      (response) => {
        console.log(response);
        // Handle success
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'forgot password successfully' });
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        }, 1500);
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'error in forgot password '
        });
        setTimeout(() => {
        }, 1500);
        // Handle error
      }
    );
  }
  navigateToRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
