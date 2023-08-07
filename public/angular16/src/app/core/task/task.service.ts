import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8000/api/tasks'; // Update with your API endpoint
  private apiUrl = 'http://localhost:8000/api/projects';
  private userUrl = 'http://localhost:8000/api/users';
  private basUrl = 'http://localhost:8000/api/tasks';
  constructor(private http: HttpClient) { }

  getAllTasks(headers: HttpHeaders) {
    const url = `${this.baseUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  projectcreate(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  createTask(taskData: any, token: string, email: string): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'create_tasks');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers };
    console.log(options);
    return this.http.post<any>(this.baseUrl, taskData, options);

  }

  getProjects(): Observable<any[]> {
    const headers = this.getHeaders(); // Get authentication headers
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  getUsers(): Observable<any[]> {
    const headers = this.getHeaders(); // Get authentication headers
    const url = `${this.userUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  private getHeaders(): HttpHeaders {
    // Construct your headers here, including authorization token
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'create_tasks');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    return headers;
  }


  gettaskById(taskId: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.baseUrl}/${taskId}`, { headers });
  }

  updateTask(taskId: string, taskData: any, headers: HttpHeaders): Observable<any> {
    return this.http.put(`${this.baseUrl}/${taskId}`, taskData, { headers });
  }
  updateTasks(taskId: string, taskData: any, headers: HttpHeaders): Observable<any> {
    return this.http.put(`${this.basUrl}/${taskId}`, taskData, { headers });
  }

  deletetask(taskId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${taskId}`;
    return this.http.delete(url, { headers });
  }

  registertask(task: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, task);
  }

  generatePDF(taskId: string): void {
    const url = `${this.baseUrl}/${taskId}/generate-pdf`;
    this.http.get(url, { responseType: 'blob' }).subscribe(
      (response: Blob) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'filename.pdf';
        a.click();
      },
      (error) => {
        console.error('Error generating PDF:', error);
      }
    );
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
