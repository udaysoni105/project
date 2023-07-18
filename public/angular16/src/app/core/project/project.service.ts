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

  getAllProjects(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProject(projectData: any): Observable<any> {
    return this.http
      .post(this.baseUrl, projectData)
      .pipe(catchError(this.handleError));
  }

  updateProject(id: string, projectData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, projectData);
  }

  deleteProject(id: string): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  softDeleteProject(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
  
  registerProject(project: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, project);
  }

  saveChanges(projectData: any, projectId: string): Observable<any> {
    return this.http.put(`${this.baseUrl}/${projectId}`, projectData);
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }
}
