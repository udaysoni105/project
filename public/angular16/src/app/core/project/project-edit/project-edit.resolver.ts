// import { ResolveFn } from '@angular/router';

// export const projectEditResolver: ResolveFn<boolean> = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectService } from '../project.service';

@Injectable({
  providedIn: 'root'
})
export class projectEditResolver implements Resolve<any> {
  constructor(private projectService: ProjectService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const projectId = route.paramMap.get('id');
    if (projectId) {
        // Inside the resolve method in project-edit.resolver.ts
console.log('Resolve: projectId', projectId);
      return this.projectService.getProjectById(projectId).pipe(
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
