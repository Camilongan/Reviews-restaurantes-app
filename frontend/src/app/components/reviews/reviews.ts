import { Component, OnInit, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { ReviewsService, Review } from '../../services/reviews'; 
import { AuthService } from '../../services/auth'; 

@Component({
  selector: 'app-reviews',
  standalone: true,
  imports: [CommonModule, FormsModule, DatePipe], 
  templateUrl: './reviews.html',
  styleUrls: ['./reviews.scss']
})
export class ReviewsComponent implements OnInit {

  private reviewsService = inject(ReviewsService);
  private authService = inject(AuthService);

  reviews: Review[] = [];
  currentReview: Review = this.getInitialReview(); 
  
  isEditing: boolean = false;
  errorMessage: string = '';

  ngOnInit(): void {
    this.loadReviews();
  }

  getInitialReview(): Review {
    return {
      nombreRestaurante: '',
      calificacion: 3, 
      fechaVisita: new Date(),
      observaciones: ''
    };
  }

  loadReviews(): void {
    this.reviewsService.getReviews().subscribe({
      next: (data) => {
        this.reviews = data;
        this.errorMessage = '';
      },
      error: (err) => {
        this.errorMessage = 'No se pudieron cargar las reseñas. ¿Sesión expirada?';
        console.error('Error al cargar reseñas:', err);
      }
    });
  }

  saveReview(): void {
    // Convertir la fecha a formato ISO string antes de enviar al backend
    const reviewData = {
      ...this.currentReview,
      fechaVisita: new Date(this.currentReview.fechaVisita).toISOString() as any 
    };

    if (this.isEditing && this.currentReview._id) {
      this.reviewsService.updateReview(this.currentReview._id, reviewData).subscribe({
        next: () => {
          this.resetForm();
          this.loadReviews();
        },
        error: (err) => this.errorMessage = 'Error al actualizar reseña.'
      });
    } else {
      this.reviewsService.createReview(reviewData).subscribe({
        next: () => {
          this.resetForm();
          this.loadReviews();
        },
        error: (err) => this.errorMessage = 'Error al crear reseña.'
      });
    }
  }

  editReview(review: Review): void {
    // Clonar el objeto y convertir la fecha de string/Date a Date para el input HTML
    this.currentReview = { 
      ...review,
      fechaVisita: new Date(review.fechaVisita)
    };
    this.isEditing = true;
  }

  deleteReview(id: string | undefined): void {
    if (!id) return;
    
    // Usamos confirm() para evitar usar alert()
    if (!confirm('¿Estás seguro de eliminar esta reseña?')) return;
    
    this.reviewsService.deleteReview(id).subscribe({
      next: () => {
        this.loadReviews();
      },
      error: (err) => this.errorMessage = 'Error al eliminar reseña.'
    });
  }

  resetForm(): void {
    this.currentReview = this.getInitialReview();
    this.isEditing = false;
    this.errorMessage = '';
  }

  logout(): void {
    this.authService.logout();
  }
}