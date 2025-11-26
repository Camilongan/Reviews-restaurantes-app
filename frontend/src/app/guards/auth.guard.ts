import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth'; 

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // 1. Verificar si el usuario tiene sesión activa
  if (authService.isLoggedIn()) {
    return true; // Acceso permitido
  } 
  
  // 2. Si no tiene sesión, redirigir al login
  router.navigate(['/login']);
  return false;
};