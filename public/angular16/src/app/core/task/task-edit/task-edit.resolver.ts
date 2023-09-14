import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { TaskService } from '../task.service';
import { HttpHeaders } from '@angular/common/http';
import { forkJoin, Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class taskEditResolver implements Resolve<any> {
  constructor(private taskService: TaskService) {}

  // resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
  //   const taskId = route.paramMap.get('id');
  //   if (taskId) {
  //     const jwtToken = localStorage.getItem('token');
  //     const email = localStorage.getItem('email');

  //     if (!jwtToken) {
  //       console.error('JWT token not found in local storage. Please log in.');
  //       return of(null); // Return an empty observable if token is not available
  //     }
  //     console.log('taskId:', taskId); // Log the taskId inside the resolve method

  //     const headers = new HttpHeaders({
  //       Authorization: `Bearer ${jwtToken}`,
  //       taskId: taskId,
  //       Permission: 'update_tasks' // Add the Permission header with the desired value
  //     });

      
  //     // return this.taskService.gettaskById(taskId, headers).pipe(
  //       return forkJoin([
  //         this.taskService.gettaskById(taskId, headers),
  //         this.taskService.getUsers()
  //       ]).pipe(
  //         map(([taskDetails, users]) => {
  //           return { taskDetails, users };
  //         }),
  //       catchError((error) => {
  //         console.error('Failed to fetch task details', error);
  //         return of(null); // Return an empty observable if there's an error
  //       })
  //     );
  //   } else {
  //     console.error('task id not provided');
  //     return of(null); // Return an empty observable if the taskId is not available
  //   }
  // }
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const taskId = route.paramMap.get('id');
    if (taskId) {
      const jwtToken = localStorage.getItem('token');
      const email = localStorage.getItem('email');

      if (!jwtToken) {
        console.error('JWT token not found in local storage. Please log in.');
        return of(null);
      }

      const headers = new HttpHeaders({
        Authorization: `Bearer ${jwtToken}`,
        taskId: taskId,
        Permission: 'update_tasks'
      });
      // console.log(this.taskService.getUser);
      return forkJoin([
        this.taskService.gettaskById(taskId, headers),
        this.taskService.getUser()
        // getUserById(taskId, headers),
      ]).pipe(
        map(([taskDetails, users]: [any, any[]]) => {
          return { taskDetails, users };
        }),
        catchError((error) => {
          console.error('Failed to fetch task details or users', error);
          return of(null);
        })
      );
    } else {
      console.error('task id not provided');
      return of(null);
    }
  }
  
}

