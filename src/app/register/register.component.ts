import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Usuario } from '../models/usuario.model';
import { UsuariosService } from '../services/usuarios.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  usuarios: Usuario[] = [];
  jugador1!: Usuario;
  jugador2!: Usuario;

  constructor(private router: Router, private usuariosService: UsuariosService) {}

  ngOnInit() {
    this.cargarUsuarios();
  }

  cargarUsuarios() {
    this.usuariosService.getUsuarios().subscribe({
      next: (data: any) => {
        this.usuarios = data as Usuario[];
        console.log('Usuarios cargados:', this.usuarios);
      },
      error: (err) => {
        console.error('Error al obtener usuarios:', err);
      }
    });
  }

  jugar() {
    // Puedes guardar los jugadores en localStorage o pasarlos a otro service
    localStorage.setItem('jugador1', JSON.stringify(this.jugador1));
    localStorage.setItem('jugador2', JSON.stringify(this.jugador2));
    this.router.navigate(['/juego']);
  }

  volver() {
    this.router.navigate(['/']);
  }
}
