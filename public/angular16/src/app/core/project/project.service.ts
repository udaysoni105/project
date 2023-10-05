import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams,HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class ProjectService {
  private baseUrl = 'http://localhost:8000/api/projects';

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService,) { }

  getAllProjects(headers: HttpHeaders): Observable<any> {
    const url = `${this.baseUrl}`;
    return this.http.get(url, { headers }).pipe(
      map(res => {
        console.log('Response:', res);
        return res;
      }),
      catchError(error => {
        console.error('Error:', error.status);
        if (error.status == 404) {
          return this.router.navigate(['/404']);
        } else if (error.status == 401) {
          console.log("401");
          // Navigate to '/401' and then force a reload of the current route
          return this.router.navigate(['/401']).then(() => {
            location.reload();
          });
        } else {
          return throwError(error.error || 'Server error');
        }
      })
    );
  }
  

  getPaginatedProjects(page: number, perPage: number, headers: HttpHeaders): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('perPage', perPage.toString());
    return this.http.get<any>(`${this.baseUrl}/pagination`, { headers, params });
  }

  hasPermission(permission: string): boolean {
    // Example: Check if the user has the given permission
    // Replace this with your actual logic
    return true; // or false
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





