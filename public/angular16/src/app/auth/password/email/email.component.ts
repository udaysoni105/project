import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  emailForm!: FormGroup;
  statusMessage: string | null = null;

  constructor(private formBuilder: FormBuilder,private router: Router) {}

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink() {
    if (this.emailForm.invalid) {
      return;
    }
    this.router.navigate(['/reset']);
    // Handle sending password reset link logic here
    this.statusMessage = 'Password reset link sent successfully.';
  }
}
