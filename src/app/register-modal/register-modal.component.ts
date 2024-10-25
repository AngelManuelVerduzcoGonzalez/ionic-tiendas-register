import { Component } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ModalController } from '@ionic/angular';
import { v4 as uuidv4 } from 'uuid'

@Component({
  selector: 'app-register-modal',
  templateUrl: './register-modal.component.html',
  styleUrls: ['./register-modal.component.scss'],
})
export class RegistroModalComponent {
  nombre: string = '';
  usuario: string = '';
  contrasena: string = '';
  confirmarContrasena: string = '';
  tienda: string = '';
  urlImagen: string = '';

  constructor(private modalCtrl: ModalController, private alertController: AlertController) {}

  cerrarModal() {
    this.modalCtrl.dismiss();
  }

  registrarUsuario() {
    if (this.nombre !== '' && this.usuario !== '' && this.contrasena !== '' && this.confirmarContrasena !== '' && this.tienda !== '' && this.urlImagen !== '') {
      if (this.contrasena !== this.confirmarContrasena) {
        this.alert('Error', 'Las contraseñas no coinciden');
        return;
      }

      // Aquí puedes manejar el registro del usuario con los datos ingresados.
      const datosUsuario = {
        id: uuidv4(),
        nombre: this.nombre,
        usuario: this.usuario,
        contrasena: this.contrasena,
        tienda: this.tienda,
        urlImagen: this.urlImagen
      };

      this.alert('Exito', 'Usuario creado con exito');

      // Cerrar el modal y enviar los datos
      this.modalCtrl.dismiss(datosUsuario);
    } else {
      this.alert('Error', 'Uno o más campos estan vacíos');
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
}
