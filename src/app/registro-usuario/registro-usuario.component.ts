import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model'; // Asegúrate de que este modelo esté actualizado
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent implements OnInit {
  // Definir el ID del juego fijo aquí para asegurar su uso
  private readonly ID_JUEGO_FIJO: string = "95ad5c3b-d186-4d62-a5f6-3548186e6d5b";

  // Inicialización del usuario con el juego_id fijo
  usuario: Usuario = {
    id: '', // Se generará un nuevo UUID al registrar
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
    juego_id: this.ID_JUEGO_FIJO // <-- Asignado el ID de juego fijo aquí
  };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Maneja el registro de un nuevo usuario.
   * Valida los campos y envía los datos al backend.
   */
  registrarUsuario(): void {
    const { name, email, password, password_confirmation } = this.usuario;

    if (name && email && password && password_confirmation) {
      if (password !== password_confirmation) {
        console.error('Las contraseñas no coinciden');
        // Implementar lógica de UI para mostrar el error al usuario
        return;
      }

      // Prepara el objeto para enviar al servicio, asegurando el juego_id fijo.
      const nuevoUsuarioParaBackend: Omit<Usuario, 'id'> = {
        name: this.usuario.name,
        email: this.usuario.email,
        password: this.usuario.password,
        password_confirmation: this.usuario.password_confirmation,
        juego_id: this.ID_JUEGO_FIJO // <-- Asegurando que el juego_id sea el fijo al enviar
      };

      this.usuariosService.crearUsuario(nuevoUsuarioParaBackend).subscribe({
        next: (res) => {
          console.log('Usuario registrado:', res);
          console.log('¡Usuario registrado con éxito!');

          // Reinicia el formulario
          this.usuario = {
            id: '',
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            juego_id: this.ID_JUEGO_FIJO // Se mantiene el ID fijo para nuevas entradas
          };
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);
          if (err.error && err.error.message) {
            console.error('Mensaje del servidor:', err.error.message);
          }
          if (err.error && err.error.errors) {
            console.error('Detalles de errores de validación:', err.error.errors);
          }
        }
      });
    } else {
      console.error('Por favor completa todos los campos.');
    }
  }
}
