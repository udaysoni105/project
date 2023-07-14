import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// interface Country {
//   name: string;
//   code: string;
// }

// interface State {
//   name: string;
//   code: string;
// }

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss']
})
export class RegistrationComponent implements OnInit {
  registrationForm!: FormGroup;
  user: any = {};
  // countries: Country[] = [];
  // states: State[] = [];
  // selectedCountry: Country | undefined;
  // selectedState: State | undefined;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.registrationForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      password_confirmation: ['', Validators.required],
      country: ['', Validators.required],
      state: ['', Validators.required]
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
}

