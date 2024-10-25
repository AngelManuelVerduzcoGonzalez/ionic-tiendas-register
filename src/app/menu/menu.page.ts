import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.page.html',
  styleUrls: ['./menu.page.scss'],
})
export class MenuPage implements OnInit {
  username: string = '';
  imagen: string = '';

  constructor(private authService: AuthService, private router: Router, private cdr: ChangeDetectorRef) { }

  ngOnInit() {
    const { usuario, urlImagen } = this.obtenerUsuario();
    this.username = usuario;
    this.imagen = urlImagen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  obtenerUsuario() {
    const usuario = localStorage.getItem('loggedInUser');
    return usuario ? JSON.parse(usuario) : {};
  }

  // Método para actualizar las variables manualmente y forzar la detección de cambios
  actualizarUsuario(usuario: any) {
    this.username = usuario.usuario;
    this.imagen = usuario.urlImagen;
    this.cdr.detectChanges(); // Forzar detección de cambios
  }
}
