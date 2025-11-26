import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth'; 

// Definición de la interfaz para la Reseña
export interface Review {
  _id?: string; 
  nombreRestaurante: string;
  calificacion: number;
  fechaVisita: Date;
  observaciones?: string;
  usuarioId?: string; 
}

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private apiUrl = 'http://localhost:3000/api/reviews';

  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private getAuthHeaders(): HttpHeaders {
    const token = this.authService.getToken();
    if (token) {
      return new HttpHeaders().set('x-auth-token', token);
    }
    return new HttpHeaders();
  }

  // C - Crear Reseña (POST)
  createReview(review: Review): Observable<Review> {
    return this.http.post<Review>(this.apiUrl, review, { headers: this.getAuthHeaders() });
  }

  // R - Obtener TODAS las reseñas del usuario logueado (GET)
  getReviews(): Observable<Review[]> {
    return this.http.get<Review[]>(this.apiUrl, { headers: this.getAuthHeaders() });
  }

  // U - Actualizar Reseña (PUT)
  updateReview(id: string, review: Partial<Review>): Observable<Review> {
    return this.http.put<Review>(`${this.apiUrl}/${id}`, review, { headers: this.getAuthHeaders() });
  }

  // D - Eliminar Reseña (DELETE)
  deleteReview(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() });
  }
}