import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-confirm',
  templateUrl: './confirm.component.html',
  styleUrls: ['./confirm.component.scss']
})
export class ConfirmComponent implements OnInit {
  confirmForm!: FormGroup;
  showForgotPasswordLink = true;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit(): void {
    this.confirmForm = this.formBuilder.group(
      {
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required]
      },
      { validators: this.passwordMatchValidator }
    );
  }

  confirmPassword(): void {
    if (this.confirmForm.invalid) {
      return;
    }

    const newPassword = this.confirmForm.get('password')?.value;

    this.updatePassword(newPassword).subscribe(
      () => {
        // Password update successful
        this.router.navigate(['/login']);
      },
      (error) => {
        // Handle error, such as displaying a message to the user
      }
    );
  }

  updatePassword(newPassword: string): Observable<any> {
    const userId = 'id'; // Replace with the actual user ID
    const url = `api/users/${userId}`; // Replace with the appropriate API endpoint
    const payload = { password: newPassword };

    return this.httpClient.put(url, payload);
  }

  passwordMatchValidator(formGroup: FormGroup) {
    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('confirmPassword');

    if (passwordControl && confirmPasswordControl) {
      if (passwordControl.value !== confirmPasswordControl.value) {
        confirmPasswordControl.setErrors({ passwordMismatch: true });
      } else {
        confirmPasswordControl.setErrors(null);
      }
    }
  }
}


