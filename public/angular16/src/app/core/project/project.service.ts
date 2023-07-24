import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = 'http://localhost:8000/api/projects';

  constructor(private http: HttpClient) {}

  // private createHeaders(): HttpHeaders {
  //   let headers = new HttpHeaders();
  //   headers = headers.append('Content-Type', 'application/json');
  //   const email = localStorage.getItem('email');
  //   headers = headers.append('email',`${email}`);
  //   const token = localStorage.getItem('token'); // Retrieve the token from local storage
  //   headers = headers.append('authentication', `Bearer ${token}`);
  //   headers = headers.append('permission', 'create_project');

  //   // Log the headers in the console to see if they are set correctly
  //   console.log('Request Headers:', headers);

  //   return headers;
  // }
  getAllProjects(headers: HttpHeaders) {
    const url = `${this.baseUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  // getAllProjects(): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(this.baseUrl, { headers });
  // }
  getProjectById(id: string): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/${id}`, {  });
  }

  createProject(projectData: any, token: string,email:string): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type','application/json');
    headers = headers.append('Permission', 'create_project');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers};
    console.log(options);
    return this.http.post<any>( this. baseUrl, projectData, options);

  }

  updateProject(id: string, projectData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, projectData);
  }

  deleteProject(id: string): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, {  });
  }

  softDeleteProject(id: number) {
    // const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, {  });
  }

  registerProject(project: any): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.post<any>(this.baseUrl, project, {  });
  }

  saveChanges(projectData: any, projectId: string): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.put(`${this.baseUrl}/${projectId}`, projectData, {  });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  searchProjects(searchQuery: string): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/search?searchQuery=${searchQuery}`, {  });
  }

  getSortedProjects(column: string, direction: string): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/sorted?column=${column}&direction=${direction}`, {  });
  }
  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
