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
  uploadImage(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', file);

    return this.http.post(`${this.apiUrl}/store`, formData);
  }

  IsLoggedIn(): boolean {
    const token = localStorage.getItem('token');
    if (token) {
      return true;
    }
    return false;
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, { email, password });
  }

  // logout(): void {
  //   localStorage.removeItem('token');
  //   this.router.navigate(['/login']); // Redirect to login page
  // }
  logout(): Observable<any> { 
    console.log("log out auth service "); 
    const token = localStorage.getItem('token'); 
    console.log(token); 
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); 
    console.log(headers); 
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

  getAllUsers(headers: HttpHeaders) {
    const url = `${this.apiUrl}/users`;
    return this.http.get<any[]>(url, { headers });
  }

  // IsLoggedIn(){
  //   return !!localStorage.getItem('token');
  // }

  createimage(payload: any, headers: HttpHeaders) {
    const url = `${this.apiUrl}/upload/image`; // Replace with your Laravel image upload endpoint
    // return this.http.post(url, formData, { headers });

    return this.http.post(url, payload, { headers });
  }
  // }
  deleteUserProfile(userId: number): Observable<any> {
    const url = `${this.apiUrl}/destroy/{image}`; // Replace with your API endpoint for deleting a user profile
    return this.http.delete(url);
  }

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
      const now = Date.now() / 9999999999999; // Convert to seconds
      return decodedToken.exp > now; // Check if the token is not expired
    }
    return false;
  }
  // isTokenValid(): boolean {
  //   const token = localStorage.getItem('token');
  //   if (token) {
  //     try {
  //       const decodedToken: any = jwt_decode(token);

  //       // Custom logic: Consider the token valid even if the 'exp' claim is missing
  //       if (!decodedToken.exp) {
  //         return true;
  //       }

  //       const now = Date.now() / 1000; // Convert to seconds
  //       return decodedToken.exp > now; // Check if the token is not expired
  //     } catch (error) {
  //       console.error("Error decoding token:", error);
  //     }
  //   }
  //   return false;
  // }


  sendPasswordResetLink(email: string): Observable<any> {
    const url = `${this.apiUrl}/forgot-password`;
    const data = { email }; // Make sure 'email' is included in the request payload
    return this.http.post<any>(url, data);
  }

  resetPassword(email: string, token: string, password: string, confirmPassword: string): Observable<any> {
    const data = {
      email: email,
      token: token, // Include the token in the request
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
