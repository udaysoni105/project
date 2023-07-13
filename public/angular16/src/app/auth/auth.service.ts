import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  // login(credentials: any): Observable<any> {
  //   return this.http.post(`${this.apiUrl}/login`, credentials);
  // }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {});
  }

  confirmPassword(token: string): Observable<any> {
    const url = `${this.apiUrl}/confirm-email`;
    return this.http.post(url, { token });
  }

  updatePassword(userId: number, password: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;
    const payload = { password };

    return this.http.put(url, payload);
  }

  resetPassword(email: string): Observable<any> {
    const url = `${this.apiUrl}/reset-password`;
    return this.http.post(url, { email });
  }

  forgotPassword(email: string) {
    // Send a POST request to the Laravel forgot password endpoint
  }

  sendResetLink(email: string): Observable<any> {
    const url = `${this.apiUrl}/send-reset-link`;
    return this.http.post(url, { email });
  }
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.apiUrl}/users`, {});
  }
  IsLoggedIn(){
    return !!localStorage.getItem('token');
  }
  login(credentials: { email: string, password: string }) {
    return this.http.post<{ token: string }>(`${this.apiUrl}/login`, credentials);
  }
  
}
