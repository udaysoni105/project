import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../auth.service';
import { MessageService } from 'primeng/api';
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
    private messageService: MessageService
  ) { }

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

  /** 
* @author : UDAY SONI
* Method name: onSubmit
* Password reset successful, navigate to login page
* Handle error, show appropriate message to the user
*/
  onSubmit(): void {
    if (this.resetForm.valid) {
      const { password, confirmPassword } = this.resetForm.value;
      this.authService.resetPassword(this.email, this.token, password, confirmPassword).subscribe(
        (response) => {
          if (response !== null && response !== "") {
            // this.users = { email: '', password: '' };
            this.messageService.add({ severity: 'success', summary: 'Success', detail: 'reset successfully password' });
            setTimeout(() => {
              this.router.navigate(['/login']);
            }, 1500);
          }
          else {
            this.messageService.add({ severity: 'warn', summary: 'warning', detail: 'unsuccessfully reset password' });
            setTimeout(() => {
            }, 1500);
          }
        },
        error => {
          console.error('Password reset error:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'diffrent password so not changes'
          });
          setTimeout(() => {
          }, 1500);
        }
      );
    }
  }
  backtologin() {
    this.router.navigate(['/login']);
  }
}