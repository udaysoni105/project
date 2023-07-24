import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders,HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8000/api/tasks'; // Update with your API endpoint

  constructor(private http: HttpClient) {}

  // private createHeaders(): HttpHeaders {
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Content-Type', 'application/json');

  //   const email = localStorage.getItem('email');
  //   headers = headers.append('email', `${email}`);
  //   const token = localStorage.getItem('token'); // Retrieve the token from local storage
  //   headers = headers.append('authentication', `Bearer ${token}`);
  //   headers = headers.append('permission', 'view_tasks');

  //   // Log the headers in the console to see if they are set correctly
  //   console.log('Request Headers:', headers);

  //   return headers;
  // }

  // getAllTasks(): Observable<any[]> {
  //   const headers = this.createHeaders();
  //   return this.http.get<any[]>(this.baseUrl, { headers });
  // }
  getAllTasks(headers: HttpHeaders) {
    const url = `${this.baseUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  // createTask(task: any): Observable<any> {
  //   return this.http
  //     .post<any>(this.baseUrl, task)
  //     .pipe(catchError(this.handleError));
  // }
  createTask(projectData: any, token: string,email:string): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type','application/json');
    headers = headers.append('Permission', 'create_project');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers};
    console.log(options);
    return this.http.post<any>( this. baseUrl, projectData, options);

  }
  
  updateTask(taskId: string, taskData: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.put(url, taskData, { headers });
  }
  getTaskById(taskId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.get(url, { headers });
  }

  deletetask(taskId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.delete(url, { headers });
  }

  registertask(task: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, task);
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      errorMessage =
        error.status === 0 ? 'Server unavailable' : error.error.message;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
