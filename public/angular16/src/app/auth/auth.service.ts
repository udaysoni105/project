import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';

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
  // getAllUsers(): Observable<any> {
  //   return this.http.get(`${this.apiUrl}/users`, {});
  // }
  getAllUsers(headers: HttpHeaders) {
    const url = `${this.apiUrl}/users`;
    return this.http.get<any[]>(url, { headers });
  }
  IsLoggedIn(){
    return !!localStorage.getItem('token');
  }
  login(email: string, password: string): Observable<any> {
    // Make the HTTP POST request with the provided email and password
    return this.http.post<{ access_token: string }>(`${this.apiUrl}/login`, { email, password });
  }
  
  getUserProfile(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
  getCountries(): Observable<any> {
    return this.http.get('/api/countries');
  }

  getStates(countryCode: string): Observable<any> {
    return this.http.get(`/api/states/${countryCode}`);
  }
  
}
// login(credentials: { email: string, password: string }, token: string) {
//   let headers = new HttpHeaders();
//   headers = headers.append('Content-Type', 'application/json');
//   headers = headers.append('permission', 'viewtask');
//   headers = headers.append('authentication', `Bearer {$token}`);
//   const httpOptions = { headers: headers };
//   console.log(httpOptions);
  
//   const data = { ...credentials }; // Spread the credentials object

//   return this.http.post(`${this.apiUrl}/login`, data, httpOptions);
// }