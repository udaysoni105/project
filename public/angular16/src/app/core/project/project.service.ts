import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
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

  getPaginatedProjects(page: number, perPage: number, headers: HttpHeaders): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<any>(`${this.baseUrl}/pagination`, { headers, params });
  }

  createProject(projectData: any, token: string, email: string): Observable<any> {
    let headers = new HttpHeaders()
    headers = headers.append('Content-Type', 'application/json');
    headers = headers.append('Permission', 'create_project');
    headers = headers.append('Authorization', `Bearer ${token}`);
    headers = headers.append('email', `${email}`);

    const options = { headers: headers };
    return this.http.post<any>(this.baseUrl, projectData, options);
  }

  searchProjects(searchQuery: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}/search?searchQuery=${searchQuery}`
    return this.http.get(url, { headers });
  }

  getSortedProjects(column: string, direction: string, headers: HttpHeaders): Observable<any> {
    return this.http.get(`${this.baseUrl}/sorted?column=${column}&direction=${direction}`, { headers });
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
    const url = `${this.baseUrl}/tasks/${projectId}`;
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

  restoreProject(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/restore`;
    return this.http.put(url, null);
  }

  softDeleteProjects(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  getSoftDeletedProjects(projectId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${projectId}/soft-deleted`;
    return this.http.get<any[]>(url);
  }
}





