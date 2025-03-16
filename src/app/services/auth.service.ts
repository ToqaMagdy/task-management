import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:8081/auth/login'; // Backend endpoint

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(this.apiUrl, { username, password })
      .pipe(
        tap((response) => {
          localStorage.setItem('jwt_token', response.token); // Store JWT
        })
      );
  }

  logout(): void {
    localStorage.removeItem('jwt_token'); // Remove token on logout
  }

  getToken(): string | null {
    return localStorage.getItem('jwt_token'); // Retrieve stored token
  }

  isLoggedIn(): boolean {
    return !!this.getToken(); // Check if user has a token
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    try {
      const decodedToken: any = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now(); // Convert to milliseconds and compare
    } catch (error) {
      return true; // If decoding fails, assume token is expired
    }
  }
}
