import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router ,ActivatedRoute} from '@angular/router';
import { AuthService } from '../../auth.service';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  email: string = '';
  token: string = '';

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]]
    });

    // Extract the token and email from the route parameters
    this.route.params.subscribe(params => {
      this.token = params['token'];
      this.email = params['email'];
    });
  }

  onSubmit(): void {
    if (this.resetForm.valid) {
      const { password, confirmPassword } = this.resetForm.value;
      this.authService.resetPassword(this.email, this.token, password, confirmPassword).subscribe(
        () => {
          // Password reset successful, navigate to login page
          this.router.navigate(['/login']);
        },
        error => {
          console.error('Password reset error:', error);
          // Handle error, show appropriate message to the user
        }
      );
    }
  }
}