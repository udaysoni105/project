import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserchecktableService {
  private apiUrl = 'http://127.0.0.1:8000/api/users';
  constructor(private http: HttpClient) { }

  getUser(headers: HttpHeaders): Observable<any[]> {
    const url = `${this.apiUrl}`;
    return this.http.get<any[]>(url, { headers });
  }
}
