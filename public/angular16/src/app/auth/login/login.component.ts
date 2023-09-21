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

  /** 
   * @author : UDAY SONI
   * Method name: login
   */
  login(): void {
    this.loading = true;
    if (this.loginForm.invalid) {
      return;
    }

    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;

    this.authService.login(email, password).subscribe(
      (response: any) => {
        if (email !== null && email !== "") {
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
      }
      else{
        this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully' });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
        }
      },
      (error) => {
        console.error(error);
        this.loading = false;

        let errorMessage = 'An error occurred. Please try again.';

        if (error.status === 401) {
          errorMessage = 'unauthorized . Please try again.';
        } else if (error.status === 404) {
          errorMessage = 'User not found.';
        }

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: errorMessage
        });

        setTimeout(() => {
        }, 1500);
      }
    );
  }

  /** 
   * @author : UDAY SONI
   * Method name: forgotPassword
   */
  forgotPassword() {
    const data = {
      email: this.email,
    };

    this.http.post('/forgot-password', data).subscribe(
      (response) => {
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'forgot password successfully' });
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
      },
      (error) => {
        console.error(error);
      }
    );
  }

  /** 
   * @author : UDAY SONI
   * Method name: navigateToRegistration
   */
  navigateToRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
