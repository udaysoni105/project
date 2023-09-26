import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private baseUrl = 'http://localhost:8000/api/tasks'; // Update with your API endpoint
  private apiUrl = 'http://localhost:8000/api/projects';
  private userUrl = 'http://localhost:8000/api/users';
  private basUrl = 'http://localhost:8000/api/task';
  constructor(private http: HttpClient) { }

  getAllTasks(headers: HttpHeaders) {
    const url = `${this.baseUrl}`;
    return this.http.get<any[]>(url, { headers });
  }
  searchTasks(searchQuery: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/search?searchQuery=${searchQuery}`
    return this.http.get(url, { headers });
  }

  getSortedtasks(column: string, direction: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.baseUrl}/sorted?column=${column}&direction=${direction}`, { headers });
  }

  projectcreate(): Observable<any> {
    return this.http.get<any>(this.apiUrl);
  }

  getPaginatedTasks(page: number, perPage: number, headers: HttpHeaders): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());

    return this.http.get<any>(`${this.baseUrl}/pagination`, { headers, params });
  }

  createTask(taskData: any, token: string, email: string): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'create_tasks');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers };
    return this.http.post<any>(this.baseUrl, taskData, options);

  }

  getProjects(): Observable<any[]> {
    const headers = this.getHeaders();
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  getUsers(): Observable<any[]> {
    const headers = this.getHeaders();
    const url = `${this.userUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  private getHeaders(): HttpHeaders {
    // Construct your headers here, including authorization token
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('email');

    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'update_tasks');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    return headers;
  }

  getProjectById(projectId: number): Observable<any> {
    const headers = this.getHeader();
    const url = `${this.apiUrl}/${projectId}`;
    return this.http.get<any[]>(url, { headers });
  }

  getProject(): Observable<any[]> {
    const headers = this.getHeader();
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  getUser(): Observable<any[]> {
    const headers = this.getHeader();
    const url = `${this.userUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  private getHeader(): HttpHeaders {
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

  getUserById(taskId: string, headers: HttpHeaders): Observable<any> {
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

  getFilteredTasks(url: string, options: { headers: HttpHeaders, params: { [param: string]: string } }): Observable<any[]> {
    // Create an instance of HttpParams
    let httpParams = new HttpParams();

    // Append the parameters to the HttpParams instance
    for (const key in options.params) {
      if (options.params.hasOwnProperty(key)) {
        httpParams = httpParams.set(key, options.params[key]);
      }
    }

    // Use the HttpParams instance in the request options
    return this.http.get<any[]>(url, { headers: options.headers, params: httpParams });
  }


  generatePDF(taskId: string, token: string, email: string): Observable<any> {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'view_pdf');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers };
    const url = `${this.baseUrl}/${taskId}/generate-pdf`;

    return this.http.post(url, {}, { responseType: 'blob', headers }).pipe(
      switchMap((response: Blob) => {
        const file = new Blob([response], { type: 'application/pdf' });
        const fileURL = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = fileURL;
        a.download = 'filename.pdf';
        a.click();
        return of(response);
      }),
      catchError((error) => {
        console.error('Error generating PDF:', error);
        return throwError(error);
      })
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
