import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router, private messageService: MessageService) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);
    return this.http.post(`${this.apiUrl}/store`, formData);
  }

  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.apiUrl}/login`);
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): Observable<any> {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http.delete<any>(`${this.apiUrl}/auth/logout`, { headers });
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

  // getAllUsers(headers: HttpHeaders) {
  //   const url = `${this.apiUrl}/users`;
  //   return this.http.get<any[]>(url, { headers });
  // }

  getAllUsers(headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/users`;
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

  createimage(payload: any, headers: HttpHeaders) {
    const url = `${this.apiUrl}/upload/image`;
    return this.http.post(url, payload, { headers });
  }

  deleteUserProfile(userId: number, deleteProfilePic: any, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/destroy/${userId}/${encodeURIComponent(deleteProfilePic.oldprofilepic)}`;

    const options = {
      headers,
      body: deleteProfilePic
    };

    return this.http.delete(url, options);
  }

  getUserProfile(headers: HttpHeaders) {
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }

  getCountries(): Observable<any[]> {
    const apiUrl = `${this.apiUrl}/countries`;
    return this.http.get<any[]>(apiUrl);
  }

  getStates(countryCode: string): Observable<any[]> {
    const apiUrl = `${this.apiUrl}/states/${countryCode}`;
    return this.http.get<any[]>(apiUrl);
  }

  showError(message: string): void {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: message });
  }

  sendPasswordResetLink(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    const data = { email };
    return this.http.post<any>(url, data);
  }

  resetPassword(email: string, token: string, password: string, confirmPassword: string): Observable<any> {
    const data = {
      email: email,
      token: token,
      password: password,
      password_confirmation: confirmPassword
    };
    return this.http.post(`${this.apiUrl}/resetpassword`, data);
  }

  searchTasks(searchQuery: string, headers: HttpHeaders): Observable<any> {
    const url = `${this.apiUrl}/users/search?searchQuery=${searchQuery}`
    return this.http.get(url, { headers });
  }
}
