import { Injectable, inject, Inject, PLATFORM_ID } from '@angular/core'; // <-- 1. Importar Inject y PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // <-- 2. Importar isPlatformBrowser
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Router } from '@angular/router';

interface Credentials {
  username: string;
  password: string;
}

interface AuthResponse {
  token: string;
  username: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:3000/api/auth'; 
  private http = inject(HttpClient);
  private router = inject(Router);
  
  constructor(@Inject(PLATFORM_ID) private platformId: Object) {} 

  private saveToken(token: string): void {
    if (isPlatformBrowser(this.platformId)) { 
      sessionStorage.setItem('token', token);
    }
  }

  getToken(): string | null {
    if (isPlatformBrowser(this.platformId)) { 
      return sessionStorage.getItem('token');
    }
    return null; 
  }


  login(credentials: Credentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, credentials)
      .pipe(
        tap(res => {
          this.saveToken(res.token); 
        })
      );
  }


  register(credentials: Credentials): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/register`, credentials);
  }


  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) { 
      sessionStorage.removeItem('token');
    }
    this.router.navigate(['/login']);
  }
}