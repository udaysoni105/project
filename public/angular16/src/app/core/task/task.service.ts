import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8000/api/tasks'; // Update with your API endpoint

  constructor(private http: HttpClient) { }

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');


    const token = localStorage.getItem('token'); // Retrieve the JWT token from local storage
    if (token) {
      headers = headers.append('Authorization', `Bearer ${token}`);
    }
    headers = headers.append('permission', 'viewtask');

    // Log the headers in the console to see if they are set correctly
    console.log('Request Headers:', headers);

    return headers;
  }

  getAllTasks(): Observable<any[]> {
    const headers = this.createHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  createTask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task).pipe(
      catchError(this.handleError)
    );
  }

  getTaskById(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }
  
  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, taskData);
  }

  // updateTask(id: string, task: any): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  //   return this.http.put<any>(url, task).pipe(
  //     catchError(this.handleError)
  //   );
  // }

  deletetask(id: string): Observable<any> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<any>(url).pipe(
      catchError(this.handleError)
    );
  }  

  // getTask(id: string): Observable<any> {
  //   return this.http.get<any>(this.apiUrl);
  // }

  // getTask(id: string): Observable<any> {
  //   return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
  //     catchError(this.handleError)
  //   );
  // }
  // getTaskById(id: string): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/${id}`);
  // }
  // getTask(id: string): Observable<any> {
  //   const url = `${this.apiUrl}/${id}`;
  
  //   return this.http.get<any>(url).pipe(
  //     catchError((error: HttpErrorResponse) => {
  //       if (error.status === 404) {
  //         console.error('Task not found', error);
  //       } else {
  //         console.error('Failed to retrieve task', error);
  //       }
  
  //       return throwError('Failed to retrieve task');
  //     })
  //   );
  // }

  registertask(task: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, task);
  } 


  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage = error.status === 0 ? 'Server unavailable' : error.error.message;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
