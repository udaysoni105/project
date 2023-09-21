import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ProjectService } from '../project.service';
import { HttpHeaders } from '@angular/common/http';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class projectEditResolver implements Resolve<any> {

  constructor(private projectService: ProjectService, private messageService: MessageService) { }

  /** 
* @author : UDAY SONI
* Method name: resolve
* Return an empty observable if token is not available
* Add the Permission header with the desired value
* Return an empty observable if there's an error
* Return an empty observable if the projectId is not available
*/
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const projectId = route.paramMap.get('id');
    if (projectId) {
      const jwtToken = localStorage.getItem('token');
      const email = localStorage.getItem('email');
      if (!jwtToken) {
        console.error('JWT token not found in local storage. Please log in.');
        return of(null);
      }
      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
        projectId: projectId,
        Permission: 'update_project'
      });
      return this.projectService.getProjectById(projectId, headers).pipe(
        catchError((error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'project data not found',
          });
          setTimeout(() => { }, 1500);
          return of(null);
        })
      );
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'project data not found',
      });
      setTimeout(() => { }, 1500);
      return of(null);
    }
  }
}
