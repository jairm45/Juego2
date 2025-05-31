import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
    startGame(players: number) {
    console.log(`${players} jugador(es) ha(n) sido seleccionado(s).`);
    // Aquí puedes navegar a la pantalla del juego
  }

  deletePlayers() {
    console.log("Jugadores eliminados.");
    // Lógica para borrar jugadores o reiniciar
  }

}
