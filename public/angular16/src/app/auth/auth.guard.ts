import { CanActivate, Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(): boolean {
    if (this.auth.IsLoggedIn()) {
      return true;
    }
alert("you have not logged IN")
    this.router.navigate(['login']);
    return false;
  }
}
