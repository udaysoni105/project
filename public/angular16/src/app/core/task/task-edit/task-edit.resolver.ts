// import { ResolveFn } from '@angular/router';

// export const taskEditResolver: ResolveFn<boolean> = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../task.service';

@Injectable({
  providedIn: 'root'
})
export class taskEditResolver implements Resolve<any> {
  constructor(private taskService: TaskService) {}

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const taskId = route.paramMap.get('id');
    if (taskId) {
      // Inside the resolve method in task-edit.resolver.ts
      console.log('Resolve: taskId', taskId);
      return this.taskService.getTaskById(taskId).pipe(
        catchError((error) => {
          console.error('Failed to fetch task details', error);
          return of(null); // Return an empty observable if there's an error
        })
      );
    } else {
      console.error('Task id not provided');
      return of(null); // Return an empty observable if the taskId is not available
    }
  }
}
