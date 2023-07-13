// import { Injectable } from '@angular/core';
// import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
// import { ProjectService } from './project.service';
// @Injectable({
//   providedIn: 'root'
// })
// export class ProjectGuard implements CanActivate {
//   constructor(private router: Router) {}

//   canActivate(
//     route: ActivatedRouteSnapshot,
//     state: RouterStateSnapshot
//   ): boolean | UrlTree {
//     // Check if the user is authenticated
//     const isAuthenticated = this.ProjectService.isAuthenticated();

//     if (!isAuthenticated) {
//       // Redirect to the login page or show an unauthorized page
//       return this.router.createUrlTree(['/login']);
//     }

//     // User is authenticated, allow access to the route
//     return true;
//   }
// }
