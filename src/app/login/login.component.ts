import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  constructor(private router: Router) {}

  startGame(jugadores: number) {
    if (jugadores === 1) {
      this.router.navigate(['/juego']);
    } else if (jugadores === 2) {
      this.router.navigate(['/registro']);
    }
  }


}
