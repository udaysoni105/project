// import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class ReactiveService {
//   private baseUrl = 'http://localhost:8000/api/projects';

//   constructor(private http: HttpClient) { }

//   restoreProject(id: number): Observable<any> {
//     const url = `${this.baseUrl}/${id}/restore`;
//     return this.http.put(url, null);
//   }

//   softDeleteProject(id: number): Observable<any> {
//     const url = `${this.baseUrl}/${id}`;
//     return this.http.delete(url);
//   }

//   getSoftDeletedProjects(projectId: number): Observable<any[]> {
//     const url = `${this.baseUrl}/${projectId}/soft-deleted`;
//     return this.http.get<any[]>(url);
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReactiveService {
  private baseUrl = 'http://localhost:8000/api/projects';

  constructor(private http: HttpClient) { }

  restoreProject(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}/restore`;
    return this.http.put(url, null);
  }

  softDeleteProject(id: number): Observable<any> {
    const url = `${this.baseUrl}/${id}`;
    return this.http.delete(url);
  }

  getSoftDeletedProjects(projectId: number): Observable<any[]> {
    const url = `${this.baseUrl}/${projectId}/soft-deleted`;
    return this.http.get<any[]>(url);
  }
}