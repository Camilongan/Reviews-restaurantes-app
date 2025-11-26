import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login'; 
import { ReviewsComponent } from './components/reviews/reviews'; 
import { authGuard } from './guards/auth.guard'; 

export const routes: Routes = [
    // Ruta por defecto: redirigir a Login
    { path: '', redirectTo: 'login', pathMatch: 'full' }, 
    
    // Ruta de Login (sin protección)
    { path: 'login', component: LoginComponent }, 
    
    // Ruta de Reviews (PROTEGIDA)
    { path: 'reviews', component: ReviewsComponent, canActivate: [authGuard] }, 
    
    // Wildcard para manejar rutas no encontradas
    { path: '**', redirectTo: 'login' }
];