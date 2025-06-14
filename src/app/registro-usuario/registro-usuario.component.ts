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
  // Eliminada la constante 'juego_id' como string, ya que la API espera un número entero (juego_id: number)

  // ACTUALIZADO: Inicialización con la estructura de Usuario corregida
  usuario: Usuario = {
    id: '', // El ID se generará al registrar si el backend lo permite, o se usará crypto.randomUUID()
    name: '', // CAMBIADO: Antes 'username'
    email: '',
    password: '',
    password_confirmation: '', // CAMBIADO: Antes 'password_confirm'
    juego_id: '' // CAMBIADO CRÍTICO: Debe ser un número entero. Asigna un ID de juego válido si es conocido.
  };

  constructor(
    private usuariosService: UsuariosService,
    private router: Router
  ) {}

  ngOnInit(): void {}

  /**
   * Maneja el registro de un nuevo usuario.
   * Valida los campos y envía los datos al backend.
   * Reemplaza 'alert()' con 'console.error' o lógica de UI de mensaje.
   */
  registrarUsuario(): void {
    // ACTUALIZADO: Desestructuración de los campos del usuario con los nombres correctos
    const { name, email, password, password_confirmation } = this.usuario;

    if (name && email && password && password_confirmation) {
      if (password !== password_confirmation) {
        console.error('Las contraseñas no coinciden'); // Reemplazado alert()
        // Aquí podrías actualizar una propiedad para mostrar un mensaje de error en el HTML
        return;
      }

      // Prepara el objeto para enviar al servicio.
      // El ID no se incluye en el POST si el backend lo genera (según tu OpenAPI).
      // Los nombres de los campos coinciden con la OpenAPI.
      const nuevoUsuarioParaBackend: Omit<Usuario, 'id'> = {
        name: this.usuario.name,
        email: this.usuario.email,
        password: this.usuario.password,
        password_confirmation: this.usuario.password_confirmation,
        juego_id: this.usuario.juego_id // Asegúrate de que este sea un número entero válido (Ej: 1, 2, 3...)
      };

      this.usuariosService.crearUsuario(nuevoUsuarioParaBackend).subscribe({
        next: (res) => {
          console.log('Usuario registrado:', res);
          console.log('¡Usuario registrado con éxito!'); // Reemplazado alert()
          // Aquí podrías mostrar un mensaje de éxito al usuario en el HTML

          // Reinicia el formulario a su estado inicial
          this.usuario = {
            id: '',
            name: '',
            email: '',
            password: '',
            password_confirmation: '',
            juego_id: '' // Restablece a 0 o al valor predeterminado del juego
          };
          this.router.navigate(['/']); // Redirige después de un registro exitoso
        },
        error: (err) => {
          console.error('Error al registrar usuario:', err);
          console.error('Ocurrió un error al registrar el usuario. Por favor, intente de nuevo.'); // Reemplazado alert()
          // Aquí podrías mostrar un mensaje de error detallado al usuario en el HTML
        }
      });
    } else {
      console.error('Por favor completa todos los campos.'); // Reemplazado alert()
      // Aquí podrías mostrar un mensaje de error al usuario sobre campos faltantes
    }
  }
}
