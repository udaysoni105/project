import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-email',
  templateUrl: './email.component.html',
  styleUrls: ['./email.component.scss']
})
export class EmailComponent implements OnInit {
  emailForm!: FormGroup;
  email: string = '';
  isRequestSent: boolean = false;
  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authservice: AuthService
  ) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  sendResetLink() {
    if (this.emailForm.invalid) {
      return;
    }
  
    const formData = this.emailForm.value;
    this.email = formData.email; 
  console.log(this.email);
    this.authservice.sendPasswordResetLink(this.email).subscribe(
      (response) => {
        console.log('Password reset request sent:', response);
        this.isRequestSent = true;
        this.router.navigate(['/login']);
      },
      (error) => {
        console.error('Error sending password reset request:', error);
      }
    );
  }
  
}
