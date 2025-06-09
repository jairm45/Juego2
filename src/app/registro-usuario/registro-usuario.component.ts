import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { JuegosService } from '../services/juegos.service'; // ✅ Importa JuegosService
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-registro-usuario',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent implements OnInit {

  usuario = {
    username: '',
    password: '',
    email: '',
    idjuego: null
  };

  usuariosList: any[] = [];
  juegosList: any[] = []; // ✅ Lista de juegos

  constructor(
    private usuariosService: UsuariosService,
    private juegosService: JuegosService // ✅ Inyección del servicio
    , private router: Router
  ) {}

  ngOnInit(): void {
    this.usuariosService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuariosList = data;
      },
      error: (err) => {
        console.error('Error al cargar usuarios:', err);
      }
    });

    this.juegosService.getJuegos().subscribe({
      next: (data: any) => {
        this.juegosList = data;
      },
      error: (err) => {
        console.error('Error al cargar juegos:', err);
      }
    });
  }

  registrarUsuario(): void {
    const { username, email, password, idjuego } = this.usuario;

    if (username && email && password && idjuego !== null) {
      this.usuariosService.crearUsuario(this.usuario).subscribe({
        next: (res: any) => {
          console.log('Usuario registrado:', res);
          alert('¡Usuario registrado con éxito!');
          this.usuario = { username: '', password: '', email: '', idjuego: null };
        },
        error: (err: any) => {
          console.error('Error al registrar usuario:', err);
          alert('Ocurrió un error al registrar el usuario.');
        }
      });
    } else {
      alert('Por favor completa todos los campos.');
    }
     this.router.navigate(['/']);
  }
}
