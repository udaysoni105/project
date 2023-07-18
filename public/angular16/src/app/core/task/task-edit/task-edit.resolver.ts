// import { ResolveFn } from '@angular/router';

// export const taskEditResolver: ResolveFn<boolean> = (route, state) => {
//   return true;
// };
import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../task.service';

@Injectable({
  providedIn: 'root'
})
export class TaskEditResolver implements Resolve<any> {

  constructor(private taskService: TaskService) { }

  resolve(route: ActivatedRouteSnapshot): Observable<any> {
    const taskId = route.params['id']; // Assuming the route parameter is named 'id'
    console.log('Resolve: taskId', taskId);
    return this.taskService.getTask(taskId).pipe(
      catchError((error) => {
        console.error('Failed to fetch task', error);
        // Handle error (e.g., show error message, navigate to error page)
        // Return an empty object or an appropriate default value
        return of({});
      })
    );
  }
}
