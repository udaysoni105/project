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
  
  constructor(private router: Router,private formBuilder: FormBuilder, private authService: AuthService,private http: HttpClient,private messageService: MessageService ){localStorage.clear()}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      return;
    }
  
    const email = this.loginForm.value.email;
    const password = this.loginForm.value.password;
  
    this.authService.login(email, password).subscribe(
      (response: any) => {
        console.log(response);
        const token = response.access_token;
        const role = response.user.role; 
        localStorage.setItem('token', token);
        localStorage.setItem('email', email);
        localStorage.setItem('password', password);
        localStorage.setItem('role', role);
        this.users = { email: '', password: '' };
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'login successfully' });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => {
          this.router.navigate(['/dashboard']);
        },1500 );
      },
      (error) => {
        console.error(error);
        this.router.navigate(['/registration']);
        console.log("user is not registered");
      }
    );
  }
  
  forgotPassword() {
    const data = {
      // email: this.email,
    };

    this.http.post('/forgot-password', data).subscribe(
      (response) => {
        console.log(response);
        // Handle success
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }
  navigateToRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
