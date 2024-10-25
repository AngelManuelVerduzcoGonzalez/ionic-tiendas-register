import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-clientes',
  templateUrl: 'clientes.page.html',
  styleUrls: ['clientes.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Activar Change Detection OnPush
})
export class ClientesPage {
  nombre = '';
  direccion = '';
  telefono = '';
  correo = '';
  url = '';
  clientes: any[] = [];
  clientesFiltrados: any[] = [];
  editIndex: number | null = null;
  busqueda = '';

  constructor(private cd: ChangeDetectorRef, private authService: AuthService, private router: Router) {
    this.clientes = this.obtenerClientesDeLocalStorage();
    this.clientesFiltrados = [...this.clientes];
  }

  Agregar() {
    if (this.nombre && this.direccion && this.telefono && this.correo && this.url) {
      const nuevoCliente = {
        id: uuidv4(),
        nombre: this.nombre,
        direccion: this.direccion,
        telefono: this.telefono,
        correo: this.correo,
        url: this.url
      };

      if (this.editIndex !== null) {
        // Editar el producto existente
        this.clientes[this.editIndex] = nuevoCliente;
        this.editIndex = null;
      } else {
        // Agregar un nuevo producto
        this.clientes.push(nuevoCliente);
      }

      // Guardar productos actualizados en localStorage
      this.guardarClientesEnLocalStorage();

      // Actualizar los productos filtrados después de agregar o editar
      this.Buscar();

      // Forzar la detección de cambios
      this.cd.markForCheck();

      // Limpiar los campos después de agregar o editar el producto
      this.LimpiarCampos();
    } else {
      console.log('Faltan datos para agregar el producto');
    }
  }

  Editar(index: number) {
    const cliente = this.clientes[index];

    this.nombre = cliente.nombre;
    this.direccion = cliente.direccion;
    this.correo = cliente.correo;
    this.telefono = cliente.telefono;
    this.url = cliente.url;

    this.editIndex = index;
    this.cd.markForCheck(); // Forzar la detección de cambios al editar
  }

  Eliminar(index: number) {
    this.clientes.splice(index, 1);
    this.guardarClientesEnLocalStorage();
    this.cd.markForCheck(); // Forzar la detección de cambios al eliminar
  }

  Buscar() {
    // Filtrar productos basados en la búsqueda
    if (this.busqueda.trim() === '') {
      this.clientesFiltrados = [...this.clientes]; // Si no hay búsqueda, mostrar todos los productos
    } else {
      this.clientesFiltrados = this.clientes.filter(cliente =>
        cliente.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
    this.cd.markForCheck(); // Forzar la detección de cambios para mostrar los productos filtrados
  }

  LimpiarCampos() {
    this.nombre = '';
    this.direccion = '';
    this.telefono = '';
    this.correo = '';
    this.url = '';
    this.cd.markForCheck(); // Forzar la detección de cambios al limpiar los campos
  }

  // Métodos para trabajar con localStorage
  guardarClientesEnLocalStorage() {
    localStorage.setItem('clientes', JSON.stringify(this.clientes));
    this.cd.markForCheck(); // Forzar la detección de cambios al guardar en localStorage
  }

  obtenerClientesDeLocalStorage(): any[] {
    const clientesGuardados = localStorage.getItem('clientes');
    return clientesGuardados ? JSON.parse(clientesGuardados) : [];
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
