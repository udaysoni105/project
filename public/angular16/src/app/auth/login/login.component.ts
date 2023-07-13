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
  user: any = {};
  // public formVali
  public isInValid !: boolean;

  
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
    };

    this.authService.login(credentials).subscribe(
      (response: any) => {
        const token = response.token;

        // Store the token in local storage
        localStorage.setItem('token', response.token);
        localStorage.setItem('token', token);

        // Redirect or perform any necessary actions after successful login
        this.router.navigate(['/dashboard']);
      },
      (error) => {
        console.error(error);
        // Handle login error
      }
    );
  }


// login(): void {
//   var isChecked = true;
//   if (!this.loginForm.valid) {
//     for (var a in this.loginForm.controls) {
//       this.loginForm.controls[a].markAsDirty();
//       this.loginForm.controls[a].updateValueAndValidity();
//       isChecked = false;
//     }
//   }
  
//   if (this.loginForm.valid) {
//     // alert('Logged in Successfully')
//     console.log(this.loginForm.value);
    
//     localStorage.setItem('token', "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJod…Y3In0.IFUx35tPfvwyQ7LrYRZEfcdA-AzGPt1ldL-ujgxvZjA");
//     this.loginForm.value.username == "admin@example.com" ? localStorage.setItem('userType', 'admin') : localStorage.setItem('userType', 'developer');
    
//     // Reset the form values only if it is not dirty (default values)
//     if (!this.loginForm.dirty) {
//       this.loginForm.reset();
//     }
//     this.router.navigate(['dashboard']);
//   }
// }

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
