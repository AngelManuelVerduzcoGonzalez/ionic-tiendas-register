import { Component, OnInit } from '@angular/core';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonInput, IonItem, IonButton, IonButtons, IonModal, IonAlert, AlertController } from '@ionic/angular/standalone';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';
import { RegistroModalComponent } from '../register-modal/register-modal.component';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  usuario: string = '';
  contrasena: string = '';
  recordarSesion: boolean = false;
  usuarios: any[] = [];

  constructor(private router: Router, private alertController: AlertController, private modalCtrl: ModalController, private authService: AuthService) {
    this.usuarios = this.obtenerUsuariosDeLocalStorage();
  }

  ngOnInit() {
  // Cargar datos del localStorage si existen
  const savedUser = localStorage.getItem('usuario');
  const savedPassword = localStorage.getItem('contrasena');
  const savedRemember = localStorage.getItem('recordarSesion');

  if (savedUser && savedPassword && savedRemember === 'true') {
    this.usuario = savedUser;
    this.contrasena = savedPassword;
    this.recordarSesion = true;  // Asegúrate de asignar true aquí si estaba marcado
  } else {
    this.recordarSesion = false; // Si no existe en localStorage, asigna false
  }
}

  onLogin() {
    if (this.usuario !== "" && this.contrasena !== "") {
      const success = this.authService.login(this.usuario, this.contrasena);
      if (success) {

        // Guardar o eliminar datos según el estado de recordarSesion
        if (this.recordarSesion) {
          // Guardar datos en localStorage
          localStorage.setItem('usuario', this.usuario);
          localStorage.setItem('contrasena', this.contrasena);
          localStorage.setItem('recordarSesion', 'true');
        } else {
          // Eliminar datos del localStorage
          this.clearLocalStorage();
        }

        // Redirigir a la página principal
          this.router.navigate(["/menu"]);
      } else {
        this.alert('Error', 'Usuario o contraseña incorrectos')
      }
    } else {
      this.alert("Error", "Alguno de los campos está vacío");
    }
  }

async abrirModalRegistro() {
    const modal = await this.modalCtrl.create({
      component: RegistroModalComponent
    });

    modal.onDidDismiss().then((data) => {
      if (data.data) {
        console.log('Usuario registrado:', data.data);
        this.usuarios.push(data.data)
        localStorage.setItem('usuarios', JSON.stringify(this.usuarios))
      }
    });

    return await modal.present();
  }

  clearLocalStorage() {
    localStorage.removeItem('usuario');
    localStorage.removeItem('contrasena');
    localStorage.removeItem('recordarSesion');
  }

  // Método para detectar cambios en la casilla de "Recordar sesión"
  toggleRecordarSesion() {
    if (this.recordarSesion) {
      // Guardar en localStorage
      localStorage.setItem('recordarSesion', 'true');
    } else {
      // Borrar del localStorage
      this.clearLocalStorage();
    }
  }

  async alert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ["OK"]
    });

    await alert.present();
  }

  obtenerUsuariosDeLocalStorage(): any[] {
    const usuariosGuardados = localStorage.getItem('usuarios');
    return usuariosGuardados ? JSON.parse(usuariosGuardados) : [];
  }
}
