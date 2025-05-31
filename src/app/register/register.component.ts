import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Jugador } from '../models/jugador.model';
import { JugadorService } from '../services/jugador.service';
@Component({
  selector: 'app-register',
  imports: [FormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
 jugador1: Jugador = { nombre: '', descripcion: '' };
  jugador2: Jugador = { nombre: '', descripcion: '' };

  constructor(private router: Router, private jugadorService: JugadorService) {}

  jugar() {
    // Guardar los jugadores en el service
    this.jugadorService.setJugadores(this.jugador1, this.jugador2);

    // Redirigir al juego de memoria
    this.router.navigate(['/juego']); // Asegúrate de que '/juego' sea la ruta correcta
  }

  volver() {
    this.router.navigate(['/']);
  }
}
