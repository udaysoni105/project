import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = 'http://localhost:8000/api/projects';

  constructor(private http: HttpClient) { }

  getAllProjects(headers: HttpHeaders) {
    const url = `${this.baseUrl}`;
    return this.http.get<any[]>(url, { headers });
  }

  createProject(projectData: any, token: string, email: string): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'create_project');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers };
    // console.log(options);
    return this.http.post<any>(this.baseUrl, projectData, options);

  }

  searchProjects(searchQuery: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/search?searchQuery=${searchQuery}`
    return this.http.get(url, { headers });
  }

  getSortedProjects(column: string, direction: string): Observable<any> {
    // const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/sorted?column=${column}&direction=${direction}`, {});
  }
  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
  getProjectById(projectId: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    return this.http.get(url, { headers });
  }

  updateProject(projectId: string, projectData: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    return this.http.put(url, projectData, { headers });
  }

  getTasksByProjectId(projectId: number): Observable<any[]> {
    const url = `${this.baseUrl}/tasks/${projectId}`; // Adjust the URL structure based on your API
    return this.http.get<any[]>(url);
  }

  softDeleteProject(projectId: number, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/${projectId}`;
    return this.http.delete(url, { headers });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  // deleteProject(id: string): Observable<any> {
  //   // const headers = this.createHeaders();
  //   return this.http.delete(`${this.baseUrl}/${id}`, {  });
  // }

  // registerProject(project: any): Observable<any> {
  //   // const headers = this.createHeaders();
  //   return this.http.post<any>(this.baseUrl, project, {  });
  // }

  // saveChanges(projectData: any, projectId: string): Observable<any> {
  //   // const headers = this.createHeaders();
  //   return this.http.put(`${this.baseUrl}/${projectId}`, projectData, {  });
  // }
  // restoreProject(id: number, headers: HttpHeaders): Observable<any> {
  //   const url = `${this.baseUrl}/${id}/restore`;
  //   return this.http.put(url, null, { headers });
  // }
}
