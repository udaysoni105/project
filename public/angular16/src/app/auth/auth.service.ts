import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import jwt_decode from 'jwt-decode'; // Import the library
import { tap } from 'rxjs/operators'; // Import the tap operator
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://127.0.0.1:8000/api';

  constructor(private http: HttpClient, private router: Router) { }

  register(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, user);
  }

  IsLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      // Check token validity here (e.g., token expiration)
      // You may need to decode the token and check the expiration date
      // For now, let's assume a simple check for token presence
      return true;
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  logout(): void {
    localStorage.removeItem('token');
    this.router.navigate(['/login']); // Redirect to login page
  }
  // logout(): Observable<any> {
  // return this.http.post(`${this.apiUrl}/logout`, {});
  // }  

  confirmPassword(token: string): Observable<any> {
    const url = `${this.apiUrl}/confirm-email`;
    return this.http.post(url, { token });
  }

  updatePassword(userId: number, password: string): Observable<any> {
    const url = `${this.apiUrl}/users/${userId}`;
    const payload = { password };

    return this.http.put(url, payload);
  }

  getAllUsers(headers: HttpHeaders) {
    const url = `${this.apiUrl}/users`;
    return this.http.get<any[]>(url, { headers });
  }

  // IsLoggedIn(){
  //   return !!localStorage.getItem('token');
  // }

  getUserProfile(token: string) {
    const headers = {
      Authorization: `Bearer ${token}`
    };
    return this.http.get(`${this.apiUrl}/profile`, { headers });
  }
  getCountries(): Observable<any[]> {
    // Replace with your actual API endpoint to fetch countries
    const apiUrl = `${this.apiUrl}/countries`;
    return this.http.get<any[]>(apiUrl);
  }

  getStates(countryCode: string): Observable<any[]> {
    // Replace with your actual API endpoint to fetch states
    const apiUrl = `${this.apiUrl}/states/${countryCode}`;
    return this.http.get<any[]>(apiUrl);
  }

  isTokenValid(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken: any = jwt_decode(token);
      const now = Date.now() / 1000000000000; // Convert to seconds
      return decodedToken.exp > now; // Check if the token is not expired
    }
    return false;
  }

  sendPasswordResetLink(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    const data = { email }; // Make sure 'email' is included in the request payload
    return this.http.post<any>(url, data);
  }

  // resetPassword(email: string, newPassword: string): Observable<any> {
  //   const resetData = { email, newPassword };// Adjust the API endpoint based on your backend setup
  //   const url = `${this.apiUrl}/resetpassword/`;
  //   return this.http.post(url, resetData);
  // }
// auth.service.ts
resetPassword(email: string, token: string, password: string, confirmPassword: string): Observable<any> {
  const data = {
    email: email,
    token: token, // Include the token in the request
    password: password,
    password_confirmation: confirmPassword
  };

  return this.http.post(`${this.apiUrl}/resetpassword`, data);
}



}
