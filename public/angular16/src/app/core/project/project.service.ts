// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProjectService {
//   private baseUrl = 'http://localhost:8000/api/projects';

//   constructor(private http: HttpClient) {}

//   getAllProjects(): Observable<any> {
//     return this.http.get(this.baseUrl);
//   }

//   getProjectById(id: string): Observable<any> {
//     return this.http.get(`${this.baseUrl}/${id}`);
//   }

//   createProject(projectData: any): Observable<any> {
//     return this.http
//       .post(this.baseUrl, projectData)
//       .pipe(catchError(this.handleError));
//   }

//   // updateProject(id: string, projectData: any): Observable<any> {
//   //   return this.http.put(`${this.baseUrl}/${id}`, projectData);
//   // }
//   updateProject(projectId: string, projectData: any): Observable<any> {
//     const url = `http://localhost:8000/api/projects/${projectId}`;
//     return this.http.put(url, projectData);
//   }
  

//   deleteProject(id: string): Observable<any> {
//     return this.http.delete(`${this.baseUrl}/${id}`);
//   }
//   softDeleteProject(id: number) {
//     return this.http.delete(`${this.baseUrl}/${id}`);
//   }
  
//   registerProject(project: any): Observable<any> {
//     return this.http.post<any>(this.baseUrl, project);
//   }

//   saveChanges(projectData: any, projectId: string): Observable<any> {
//     return this.http.put(`${this.baseUrl}/${projectId}`, projectData);
//   }

//   private handleError(error: any) {
//     console.error('An error occurred:', error);
//     return throwError(error);
//   }
//   getProjects(): Observable<any> {
//     return this.http.get(`${this.baseUrl}`);
//   }

//   searchProjects(searchQuery: string): Observable<any> {
//     return this.http.get(`${this.baseUrl}/search?searchQuery=${searchQuery}`);
//   }

//   getSortedProjects(column: string, direction: string): Observable<any> {
//     return this.http.get(`${this.baseUrl}/sorted?column=${column}&direction=${direction}`);
//   }
// }

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

  private createHeaders(): HttpHeaders {
    let headers = new HttpHeaders();
    headers = headers.append('Content-Type', 'application/json');
    const email = localStorage.getItem('email');
    headers = headers.append('email',`${email}`);
    const token = localStorage.getItem('token'); // Retrieve the token from local storage
    headers = headers.append('authentication', `Bearer ${token}`);
    headers = headers.append('permission', 'view_tasks');


    // Log the headers in the console to see if they are set correctly
    console.log('Request Headers:', headers);

    return headers;
  }

  // Other methods remain unchanged...

  // getAllProjects(): Observable<any> {
  //   const headers = this.createHeaders();
  //   return this.http.get(this.baseUrl, { headers });
  // }

    getAllProjects(): Observable<any> {
    return this.http.get(this.baseUrl);
  }

  getProjectById(id: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/${id}`, { headers });
  }

  createProject(projectData: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post(this.baseUrl, projectData, { headers }).pipe(catchError(this.handleError));
  }

  // updateProject(projectId: string, projectData: any): Observable<any> {
  //   const headers = this.createHeaders();
  //   const url = `${this.baseUrl}/${projectId}`;
  //   return this.http.put(url, projectData, { headers });
  // }

    updateProject(id: string, projectData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, projectData);
  }
//   updateProject(projectId: string, projectData: any): Observable<any> {
//     const url = `http://localhost:8000/api/projects/${projectId}`;
//     return this.http.put(url, projectData);
//   }

  deleteProject(id: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  softDeleteProject(id: number) {
    const headers = this.createHeaders();
    return this.http.delete(`${this.baseUrl}/${id}`, { headers });
  }

  registerProject(project: any): Observable<any> {
    const headers = this.createHeaders();
    return this.http.post<any>(this.baseUrl, project, { headers });
  }

  saveChanges(projectData: any, projectId: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.put(`${this.baseUrl}/${projectId}`, projectData, { headers });
  }

  private handleError(error: any) {
    console.error('An error occurred:', error);
    return throwError(error);
  }

  searchProjects(searchQuery: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/search?searchQuery=${searchQuery}`, { headers });
  }

  getSortedProjects(column: string, direction: string): Observable<any> {
    const headers = this.createHeaders();
    return this.http.get(`${this.baseUrl}/sorted?column=${column}&direction=${direction}`, { headers });
  }
  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}
