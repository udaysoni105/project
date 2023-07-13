import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private baseUrl = 'http://localhost:8000/api/projects';

  constructor(private http: HttpClient) { }

  getAllProjects(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getProjectById(id: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  createProject(projectData: any): Observable<any> {
    return this.http.post(this.baseUrl, projectData);
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
  saveChanges(project: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, project);
  }
}
