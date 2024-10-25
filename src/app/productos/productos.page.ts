import { Component, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-productos',
  templateUrl: 'productos.page.html',
  styleUrls: ['productos.page.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush // Activar Change Detection OnPush
})
export class HomePage {
  nombre = '';
  descripcion = '';
  cantidad: number = 0;
  precioCosto: number = 0;
  precioVenta: number = 0;
  url = '';
  productos: any[] = [];
  productosFiltrados: any[] = []; // Para mostrar productos filtrados
  editIndex: number | null = null;
  busqueda = '';

  constructor(private cd: ChangeDetectorRef, private authService: AuthService) {
    this.productos = this.obtenerProductosDeLocalStorage();
    this.productosFiltrados = [...this.productos]; // Inicialmente todos los productos
  }

  Agregar() {
    if (this.nombre && this.descripcion && this.cantidad && this.precioCosto && this.precioVenta && this.url) {
      const nuevoProducto = {
        nombre: this.nombre,
        descripcion: this.descripcion,
        cantidad: this.cantidad,
        precioCosto: this.precioCosto,
        precioVenta: this.precioVenta,
        url: this.url
      };

      if (this.editIndex !== null) {
        // Editar el producto existente
        this.productos[this.editIndex] = nuevoProducto;
        this.editIndex = null;
      } else {
        // Agregar un nuevo producto
        this.productos.push(nuevoProducto);
      }

      // Guardar productos actualizados en localStorage
      this.guardarProductosEnLocalStorage();

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
    const producto = this.productos[index];
    this.nombre = producto.nombre;
    this.descripcion = producto.descripcion;
    this.cantidad = producto.cantidad;
    this.precioCosto = producto.precioCosto;
    this.precioVenta = producto.precioVenta;
    this.url = producto.url;

    this.editIndex = index;
    this.cd.markForCheck(); // Forzar la detección de cambios al editar
  }

  Eliminar(index: number) {
    this.productos.splice(index, 1);
    this.guardarProductosEnLocalStorage();
    this.Buscar(); // Actualizar los productos filtrados después de eliminar
    this.cd.markForCheck(); // Forzar la detección de cambios al eliminar
  }

  Buscar() {
    // Filtrar productos basados en la búsqueda
    if (this.busqueda.trim() === '') {
      this.productosFiltrados = [...this.productos]; // Si no hay búsqueda, mostrar todos los productos
    } else {
      this.productosFiltrados = this.productos.filter(producto =>
        producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
      );
    }
    this.cd.markForCheck(); // Forzar la detección de cambios para mostrar los productos filtrados
  }

  LimpiarCampos() {
    this.nombre = '';
    this.descripcion = '';
    this.cantidad = 0;
    this.precioCosto = 0;
    this.precioVenta = 0;
    this.url = '';
    this.cd.markForCheck(); // Forzar la detección de cambios al limpiar los campos
  }

  // Métodos para trabajar con localStorage
  guardarProductosEnLocalStorage() {
    localStorage.setItem('productos', JSON.stringify(this.productos));
    this.cd.markForCheck(); // Forzar la detección de cambios al guardar en localStorage
  }

  obtenerProductosDeLocalStorage(): any[] {
    const productosGuardados = localStorage.getItem('productos');
    return productosGuardados ? JSON.parse(productosGuardados) : [];
  }

  logout() {
    this.authService.logout();
  }
}
