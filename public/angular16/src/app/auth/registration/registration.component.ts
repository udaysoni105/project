import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { MessageService } from 'primeng/api';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

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
      // Transform the object into an array of objects
      this.countries = Object.keys(data).map(key => ({ alpha2Code: key, name: data[key] }));
    });

  }

  /** 
* @author : UDAY SONI
* Method name: onCountryChange
* Fetch states based on the selected country
* Transform the associative array into an array of objects
*/
  onCountryChange(): void {
    if (this.selectedCountryCode) {
      this.authService.getStates(this.selectedCountryCode).subscribe((data: any) => {
        this.states = Object.keys(data).map(key => ({ alpha2Code: key, name: data[key] }));
      });
    } else {
      this.states = [];
    }
  }

  /** 
* @author : UDAY SONI
* Method name: register
*/
  register() {
    this.authService.register(this.registrationForm.value).subscribe(
      response => {
        if (response !== null && response !== "" && response !== undefined) {
          // if (this.registrationForm !== null && this.registrationForm.value !== "") {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'register successfully' });
          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        }
        else {
          this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully' });
          setTimeout(() => {
          }, 1500);
        }
      },
      error => {
        if (error && error.error && error.error.message) {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'error in registration '
          });
          setTimeout(() => {
          }, 1500);
        }
      }
    );
  }

  backtologin() {
    this.router.navigate(['/login']);
  }
}
