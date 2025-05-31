import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  jugador1 = { nombre: '', edad: null };
  jugador2 = { nombre: '', edad: null };

  constructor(private router: Router) {}

  jugar() {
    // Aquí podrías guardar los datos en un servicio si los necesitas en otra parte
    console.log('Jugador 1:', this.jugador1);
    console.log('Jugador 2:', this.jugador2);

    // Redirigir al componente del juego
    this.router.navigate(['/juego']); // Cambia '/juego' al path correcto
  }

  volver() {
    this.router.navigate(['/']); // Vuelve al login
  }
}
