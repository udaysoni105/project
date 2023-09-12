import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
@Injectable({
  providedIn: 'root'
})
export class AppService {
  private apiUrl = 'http://127.0.0.1:8000/api';
  constructor(private http: HttpClient) { }
  logout(): Observable<any> { 
    console.log("log out auth service "); 
    const token = localStorage.getItem('token'); 
    console.log(token); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
    console.log(headers); 
    return this.http.delete<any>(`${this.apiUrl}/logout`, { headers }); 
  }
}
