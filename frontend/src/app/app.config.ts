import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
// 1. IMPORTAR el módulo para el cliente HTTP
import { provideHttpClient } from '@angular/common/http'; 

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    // 2. PROVEER el cliente HTTP al framework
    provideHttpClient() 
  ]
};