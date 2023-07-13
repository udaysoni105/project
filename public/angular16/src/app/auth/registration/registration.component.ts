import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  data: any = {};
  user: any = {};

  confirmPassword: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {
    this.registrationForm = this.formBuilder.group({
      // Define your form controls here
    });
  }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required]
    });
  }

  register() {
    this.authService.register(this.user).subscribe(
      response => {
        // Registration successful
        console.log('User registered successfully', response);
        // Redirect to the desired path
        this.router.navigate(['/login']);
      },
      error => {
        // Registration failed
        console.log('Registration failed:', error);
        // Display error message to the user
        // Log the detailed error message
        if (error && error.error && error.error.message) {
          console.error('Error message:', error.error.message);
        }
      }
    );
  }
}
