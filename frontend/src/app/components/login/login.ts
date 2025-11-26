import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth'; // <-- DESCOMENTADO: Servicio real

// Define las interfaces para las credenciales, simplificado a solo usuario y contraseña
interface Credentials {
  username: string; // Usaremos 'username' para simplificar, pero puede ser correo en el backend
  password: string;
}

// Nota: Asegúrate de que este componente esté correctamente configurado 
// para usar los módulos FormsModule y CommonModule en tu aplicación.
@Component({
  selector: 'app-login', 
  templateUrl: './login.html', 
  styleUrls: ['./login.scss'], 
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  // ===========================================
  // PROPIEDADES REQUERIDAS POR LA PLANTILLA HTML
  // ===========================================
  
  // 1. Credenciales únicas para el formulario
  credentials: Credentials = { username: '', password: '' };
  
  // 2. Propiedad para mostrar mensajes de error y éxito
  errorMessage: string = '';
  successMessage: string = '';

  private router = inject(Router);
  private authService = inject(AuthService); // <-- DESCOMENTADO: Inyección del servicio

  constructor() { }

  // Métodos de alternancia ya no son necesarios
  
  resetMessages() {
    this.errorMessage = '';
    this.successMessage = '';
  }

  /**
   * Maneja el proceso de inicio de sesión (USANDO SERVICIO REAL)
   */
  login() {
    this.resetMessages();
    console.log('Intentando iniciar sesión con:', this.credentials);

    // TODO: Implementar la llamada a tu AuthService real aquí:
    this.authService.login(this.credentials).subscribe({
      next: () => {
        // Navegación SÓLO si el backend responde con éxito y el servicio guarda el token
        console.log("Inicio de sesión exitoso. Redirigiendo a /reviews...");
        this.successMessage = 'Inicio de sesión exitoso.';
        this.router.navigate(['/reviews'])
            .catch(error => {
                // Esto atrapa errores de enrutamiento si /reviews no existe
                console.error("ERROR: La navegación falló. ¿Ruta /reviews no definida?", error);
                this.errorMessage = "Error de navegación. Confirma que la ruta '/reviews' existe en tu app.routes.ts.";
            });
      },
      error: (err) => {
        console.error("Error del servidor/credenciales:", err);
        // Muestra un mensaje de error basado en la respuesta HTTP
        this.errorMessage = 'Credenciales inválidas. Por favor, verifica tu usuario y contraseña.';
      }
    });

    // --- Simulación de éxito INMEDIATO (ELIMINADA) ---
    // Eliminada para usar el flujo real del AuthService.
  }

  /**
   * Maneja el proceso de registro de nuevo usuario
   */
  register() {
    this.resetMessages();
    console.log('Intentando registrar usuario con:', this.credentials);

    this.authService.register(this.credentials).subscribe({
      next: () => {
        this.successMessage = '¡Registro exitoso! Por favor, inicia sesión ahora.';
        this.credentials = { username: '', password: '' }; // Limpiar campos
      },
      error: (err) => {
        console.error("Error de registro:", err);
        this.errorMessage = 'Error en el registro. El usuario o correo podría ya existir.';
      }
    });
  }
}