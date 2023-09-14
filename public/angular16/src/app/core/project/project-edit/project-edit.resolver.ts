import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectService } from '../project.service';
import { HttpHeaders } from '@angular/common/http'; 

@Injectable({
  providedIn: 'root'
})
export class projectEditResolver implements Resolve<any> {
  constructor(private projectService: ProjectService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const projectId = route.paramMap.get('id');
    if (projectId) {
      const jwtToken = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      

      if (!jwtToken) {
        console.error('JWT token not found in local storage. Please log in.');
        return of(null); // Return an empty observable if token is not available
      }
      // console.log('projectId:', projectId); // Log the taskId inside the resolve method

      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
        projectId: projectId,
        Permission: 'update_project' // Add the Permission header with the desired value
      });

      return this.projectService.getProjectById(projectId, headers).pipe(
        catchError((error) => {
          console.error('Failed to fetch project details', error);
          return of(null); // Return an empty observable if there's an error
        })
      );
    } else {
      console.error('Project id not provided');
      return of(null); // Return an empty observable if the projectId is not available
    }
  }
}
