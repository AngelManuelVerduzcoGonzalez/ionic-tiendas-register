import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private router: Router) {}

  // Simula el estado de autenticación almacenado en localStorage
  isAuthenticated(): boolean {
    const user = localStorage.getItem('loggedInUser');
    return !!user; // Retorna true si existe un usuario logueado
  }

  // Simula iniciar sesión y guardar el estado del usuario
  login(username: string, password: string): boolean {
    const users = JSON.parse(localStorage.getItem('usuarios') || '[]');
    const user = users.find((u: any) => u.usuario === username && u.contrasena === password);

    if (user) {
      localStorage.setItem('loggedInUser', JSON.stringify(user));
      return true;
    }

    return false;
  }

  // Cerrar sesión
  logout() {
    localStorage.removeItem('loggedInUser');
    this.router.navigate(["/login"]);
  }
}
