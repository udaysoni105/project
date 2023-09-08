import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormControl, FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  user: any = {};
  formGroup!: FormGroup;
  countries: any[] = [];
  states: any[] = [];
  selectedCountryCode: string = '';
  selectedStateCode: string = '';

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required]
    });
    this.authService.getCountries().subscribe((data: any) => {
      // console.log(data); // Check the data structure in the browser console

      // Transform the object into an array of objects
      this.countries = Object.keys(data).map(key => ({ alpha2Code: key, name: data[key] }));
    });
  }

  onCountryChange(): void {
    // console.log('Selected Country Code:', this.selectedCountryCode); // Debug line
    // Fetch states based on the selected country
    if (this.selectedCountryCode) {
      this.authService.getStates(this.selectedCountryCode).subscribe((data: any) => {
        // console.log('Fetched States:', data); // Debug line
        // Transform the associative array into an array of objects
        this.states = Object.keys(data).map(key => ({ alpha2Code: key, name: data[key] }));
      });
    } else {
      this.states = [];
    }
  }

  register() {
    this.authService.register(this.registrationForm.value).subscribe(
      response => {
        // Registration successful

        // console.log('User registered successfully', response);
        // Redirect to the desired path
        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'register successfully' });

        // Use setTimeout to navigate after a delay (e.g., 1500 milliseconds)
        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1500);
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
