import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss']
})

export class MainComponent implements OnInit {
  email!: string;
  password!: string;
  loginForm!: FormGroup;
  user: any = {};
  // public formVali
  public isInValid !: boolean;

  
  constructor(private router: Router,private formBuilder: FormBuilder, private authService: AuthService,private http: HttpClient){localStorage.clear()}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  login():void{
    var isChecked = true;
    if(!this.loginForm.valid){
      for(var a in this.loginForm.controls){
        this.loginForm.controls[a].markAsDirty();
        this.loginForm.controls[a].updateValueAndValidity();
        isChecked = false;
      }
    }
    if(this.loginForm.valid){
      // alert('Logged in Successfully')
      console.log(this.loginForm.value)

      localStorage.setItem('token',"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJod…Y3In0.IFUx35tPfvwyQ7LrYRZEfcdA-AzGPt1ldL-ujgxvZjA")
      this.loginForm.value.username=="soniuday235@gmail.com"? localStorage.setItem('userType','developer'):localStorage.setItem('userType','admin')

      this.loginForm.reset();
      this.router.navigate(['dashboard'])
    }
  }

  forgotPassword() {
    const data = {
      // email: this.email,
    };

    this.http.post('/forgot-password', data).subscribe(
      (response) => {
        console.log(response);
        // Handle success
      },
      (error) => {
        console.error(error);
        // Handle error
      }
    );
  }

  navigateToRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
