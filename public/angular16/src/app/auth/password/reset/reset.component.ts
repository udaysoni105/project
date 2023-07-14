import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../auth.service';
@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.scss']
})
export class ResetComponent implements OnInit {
  resetForm!: FormGroup;
  token: string | null = null;
  form :any[]=[];
  // email:null;
  constructor(private formBuilder: FormBuilder,private authService: AuthService,private router: Router) {}

  ngOnInit() {
    this.resetForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      passwordConfirmation: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.resetForm.invalid) {
      return;
    }

    // Handle password reset logic here
    this.router.navigate(['/login']);
  }

  // onSubmit(){
  //   this.authService.resetpassword(this.form).subscribe(
  //     data => this.handleResponse(data),
  //     error => this.notify.error(erro.error.error)
  //   );
  // }
  // handleResponse(response){
  //   this.form.email = null;
  // }
}
