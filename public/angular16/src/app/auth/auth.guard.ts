import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class authGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) { }

  // canActivate(): boolean {
  //   if (this.auth.IsLoggedIn()) {
  //     return true;
  //   }
  //   // alert("You Have Not Logged IN")
  //   this.router.navigate(['login']);
  //   return false;
  // }

  // canActivate(): boolean {
  //   if (this.auth.isTokenValid()) {
  //     return true;
  //   } else {
  //     this.router.navigate(['/login']);
  //     return false;
  //   }
  // }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    if (localStorage.getItem('token')) {
      return true;
    } else {
      // console.error('Authentication failed. User is not authenticated.');
      this.auth.showError('You are not authenticated.');
      this.router.navigate(['/login']);
      return false;
    }
  }

}
