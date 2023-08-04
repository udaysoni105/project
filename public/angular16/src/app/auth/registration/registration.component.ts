import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
// import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
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
  // selectedCountryCode: string | undefined;
  // selectedStateCode: string | undefined;
  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient,
    private messageService: MessageService
  ) { }

  ngOnInit() {
    // this.fetchCountries();
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required]
    }, {
      // validator: this.passwordMatchValidator // Custom validator to check password match
    });

    // this.authService.getCountries().subscribe(
    //   (countries: Country[]) => {
    //     this.countries = countries;
    //   },
    //   (error) => {
    //     console.error('Failed to fetch countries:', error);
    //   }
    // );
  }
  // Custom validator function to check if passwords match


  register() {
    this.authService.register(this.registrationForm.value).subscribe(
      response => {
        // Registration successful

        console.log('User registered successfully', response);
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
  // register() {
  //   this.authService.register(this.registrationForm.value).subscribe(
  //     response => {
  //       // Registration successful
  //       console.log('User registered successfully', response);
  //       // Redirect to the desired path
  //       this.router.navigate(['/login']);
  //     },
  //     error => {
  //       // Registration failed
  //       console.log('Registration failed:', error);
  //       // Display error message to the user
  //       // Log the detailed error message
  //       if (error && error.error && error.error.message) {
  //         console.error('Error message:', error.error.message);
  //       }
  //     }
  //   );
  // }

  // onCountryChange() {
  //   if (this.selectedCountry) {
  //     // Make an HTTP request to fetch the states based on the selected country
  //     this.http.get<State[]>(`/api/states/${this.selectedCountry.code}`).subscribe(states => {
  //       this.states = states;
  //     });
  //   } else {
  //     this.states = [];
  //   }
  // }
  // onCountryChange(selectedCountryCode: string) {
  //   // Make an HTTP request to fetch the states based on the selected country
  //   this.authService.getStates(selectedCountryCode).subscribe(
  //     (states: State[]) => {
  //       this.states = states;
  //     },
  //     (error) => {
  //       console.error('Failed to fetch states:', error);
  //     }
  //   );
  // }
  // fetchCountries() {
  //   this.authService.getCountries().subscribe(
  //     (data) => {
  //       this.countries = data;
  //     },
  //     (error) => {
  //       console.error('Error fetching countries:', error);
  //     }
  //   );
  // }

  // fetchStates() {
  //   if (this.selectedCountryCode) {
  //     this.authService.getStates(this.selectedCountryCode).subscribe(
  //       (data) => {
  //         this.states = data;
  //       },
  //       (error) => {
  //         console.error('Error fetching states:', error);
  //       }
  //     );
  //   } else {
  //     this.states = [];
  //   }
  // }
}
