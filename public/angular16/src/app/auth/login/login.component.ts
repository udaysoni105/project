import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

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
  
  constructor(private router: Router,private formBuilder: FormBuilder, private authService: AuthService,private http: HttpClient){localStorage.clear()}

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

    const credentials = {
      email: this.loginForm.value.email,
      password: this.loginForm.value.password,
      Login_As: this.loginForm.value.Login_As
    };

    //   const token = localStorage.getItem('token'); // Corrected code
    //   console.log(token);
  
    console.log(credentials);
    // this.authService.login(credentials, 'token').subscribe(
    this.authService.login(credentials).subscribe(
      (response: any) => {
        console.log(response);
        const token = response.access_token;
        localStorage.setItem('token', token);
        this.router.navigate(['/dashboard']);
        localStorage.setItem('email', this.users.email);
        localStorage.setItem('password', this.users.password);
        localStorage.setItem('Login_As', this.users.Login_As);
        this.users = { email: '', password: '' ,Login_As:''};

        // Store the token in local storage
        // localStorage.setItem('token', response.token);
        // localStorage.setItem('token', token);

        // Redirect or perform any necessary actions after successful login
        // this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error(error);
        this.router.navigate(['/registration']);
        console.log("user is not register");
        // Handle login error
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
