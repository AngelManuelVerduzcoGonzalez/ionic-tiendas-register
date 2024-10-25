import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../guards/auth.guard';
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

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    const { usuario, urlImagen } = this.obtenerUsuario();
    this.username = usuario
    this.imagen = urlImagen
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  obtenerUsuario() {
    const usuario = localStorage.getItem('loggedInUser');
    return usuario ? JSON.parse(usuario) : {};
  }

}
