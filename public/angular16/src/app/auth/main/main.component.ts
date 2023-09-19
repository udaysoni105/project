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
  loginForm!: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder, private authService: AuthService, private http: HttpClient) { localStorage.clear() }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  /** 
* @author : UDAY SONI
* Method name: navigateToRegistration
*/
  navigateToRegistration(): void {
    this.router.navigate(['/registration']);
  }
}
