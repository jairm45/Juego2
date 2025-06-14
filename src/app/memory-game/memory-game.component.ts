import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Partida } from '../models/partida.model'; // Asegúrate de que este modelo esté actualizado
import { Usuario } from '../models/usuario.model'; // Asegúrate de que este modelo esté actualizado
import { AciertosService } from '../services/aciertos.service';
import { JuegosService } from '../services/juegos.service';
import { PartidaService } from '../services/partida.service';

interface Card {
  id: number;
  symbol: string;
  flipped: boolean;
  matched: boolean;
  matchedBy: number | null;
}

@Component({
  selector: 'app-memory-game',
  templateUrl: './memory-game.component.html',
  styleUrls: ['./memory-game.component.css'],
  standalone: true,
  imports: [CommonModule, HttpClientModule]
})
export class MemoryGameComponent implements OnInit, OnDestroy {
  cards: Card[] = [];
  symbols: string[] = ['★', '☂', '☯', '✿', '✪', '♛', '☀', '⚡'];
  flippedCards: Card[] = [];
  currentPlayer: number = 1;

  jugador1: Usuario = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };
  jugador2: Usuario = { id: '', name: '', email: '', password: '', password_confirmation: '', juego_id: '' };

  gameStats = {
    player1: { moves: 0, pairs: 0, time: 0 }, // 'time' ahora acumulará el tiempo individual
    player2: { moves: 0, pairs: 0, time: 0 }  // 'time' ahora acumulará el tiempo individual
  };

  timerInterval: any;
  totalGameTime: number = 0; // Esta variable ahora solo para referencia, el tiempo individual está en gameStats
  showWinMessageFlag: boolean = false;
  winner: number | null = null;
  winnerText: string = '';

  juegoListObject?: any = [];

  private readonly ID_JUEGO_FIJO: string = "95ad5c3b-d186-4d62-a5f6-3548186e6d5b";

  constructor(
    private juegosService: JuegosService,
    private partidaService: PartidaService,
    private aciertosService: AciertosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.juegosService.getAllJuegos().subscribe(data => this.juegoListObject = data);

    const jugador1Data = localStorage.getItem('jugador1');
    const jugador2Data = localStorage.getItem('jugador2');

    if (jugador1Data && jugador2Data) {
      const parsedJugador1 = JSON.parse(jugador1Data);
      const parsedJugador2 = JSON.parse(jugador2Data);

      this.jugador1 = {
        id: parsedJugador1.id || '',
        name: parsedJugador1.name || parsedJugador1.username || '',
        email: parsedJugador1.email || '',
        password: parsedJugador1.password || '',
        password_confirmation: parsedJugador1.password_confirmation || parsedJugador1.password_confirm || '',
        juego_id: parsedJugador1.juego_id || parsedJugador1.idjuego || this.ID_JUEGO_FIJO
      };

      this.jugador2 = {
        id: parsedJugador2.id || '',
        name: parsedJugador2.name || parsedJugador2.username || '',
        email: parsedJugador2.email || '',
        password: parsedJugador2.password || '',
        password_confirmation: parsedJugador2.password_confirmation || parsedJugador2.password_confirm || '',
        juego_id: parsedJugador2.juego_id || parsedJugador2.idjuego || this.ID_JUEGO_FIJO
      };
      console.log('Jugadores de localStorage cargados y adaptados en MemoryGame:', this.jugador1, this.jugador2);
    } else {
      console.error('Jugadores no encontrados en localStorage. Redirige al registro si es necesario.');
    }

    this.resetGame();
  }

  volverInicio(){
    this.router.navigate(['/']);
  }

  ngOnDestroy() {
    clearInterval(this.timerInterval);
  }

  resetGame() {
    this.showWinMessageFlag = false;
    this.winner = null;
    this.winnerText = '';
    this.currentPlayer = 1;
    this.totalGameTime = 0; // Se sigue reseteando, pero ya no es la fuente principal del tiempo de aciertos

    this.gameStats.player1 = { moves: 0, pairs: 0, time: 0 }; // Resetea tiempo individual
    this.gameStats.player2 = { moves: 0, pairs: 0, time: 0 }; // Resetea tiempo individual

    this.flippedCards = [];

    this.cards = this.shuffleCards(this.symbols.concat(this.symbols)).map((symbol, index) => ({
      id: index,
      symbol,
      flipped: false,
      matched: false,
      matchedBy: null
    }));

    clearInterval(this.timerInterval);
    this.startTimer();
  }

  shuffleCards(array: string[]): string[] {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  flipCard(card: Card) {
    if (card.flipped || card.matched || this.flippedCards.length >= 2 || this.showWinMessageFlag) return;

    card.flipped = true;
    this.flippedCards.push(card);

    if (this.flippedCards.length === 2) {
      this.processMove();
    }
  }

  processMove() {
    const [first, second] = this.flippedCards;
    const playerKey = `player${this.currentPlayer}` as 'player1' | 'player2';

    this.gameStats[playerKey].moves++;

    if (first.symbol === second.symbol) {
      first.matched = true;
      second.matched = true;
      first.matchedBy = this.currentPlayer;
      second.matchedBy = this.currentPlayer;

      this.gameStats[playerKey].pairs++;

      this.flippedCards = [];

      if (this.checkWin()) {
        this.endGame();
      }
    } else {
      setTimeout(() => {
        first.flipped = false;
        second.flipped = false;
        this.flippedCards = [];
        this.switchPlayer();
      }, 1200);
    }
  }

  switchPlayer() {
    // Cuando se cambia de jugador, el timerInterval que está corriendo actualizará al nuevo jugador
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  checkWin(): boolean {
    return this.cards.every(card => card.matched);
  }

  endGame() {
    this.showWinMessageFlag = true;

    let ganador = 0;
    if (this.gameStats.player1.pairs > this.gameStats.player2.pairs) {
      this.winner = ganador = 1;
      this.winnerText = `¡${this.jugador1.name} gana! 🎉`;
    } else if (this.gameStats.player2.pairs > this.gameStats.player1.pairs) {
      this.winner = ganador = 2;
      this.winnerText = `¡${this.jugador2.name} gana! 🎉`;
    } else {
      this.winner = 0;
      this.winnerText = '¡Empate!';
    }

    clearInterval(this.timerInterval); // Detiene el contador al finalizar el juego

    const today = new Date();
    const formattedDate = today.getFullYear() + '-' +
                          String(today.getMonth() + 1).padStart(2, '0') + '-' +
                          String(today.getDate()).padStart(2, '0');

    // La partida aún guarda el tiempo total, no el individual
    const partidaPayload: Omit<Partida, 'id'> = {
      juego_id: this.ID_JUEGO_FIJO,
      fecha: formattedDate,
      tiempo: this.totalGameTime, // Se mantiene el tiempo total de la partida para este payload
      nivel: 'Facil'
    };

    console.log('Objeto partida a enviar (payload):', partidaPayload);

    this.partidaService.createPartida(partidaPayload).subscribe({
      next: (res: any) => {
        console.log('✅ Partida guardada:', res);

        const partidaId = res.id;

        // CONSTRUCCIÓN DE LOS OBJETOS ACIERTOS: user_id y tiempo individual como NÚMEROS
        const aciertosJugador1Payload = {
          partida_id: partidaId,
          user_id: Number(this.jugador1.id),
          aciertos: this.gameStats.player1.pairs,
          tiempo: this.gameStats.player1.time // <-- ¡Ahora se envía el tiempo individual del jugador 1!
        };

        const aciertosJugador2Payload = {
          partida_id: partidaId,
          user_id: Number(this.jugador2.id),
          aciertos: this.gameStats.player2.pairs,
          tiempo: this.gameStats.player2.time // <-- ¡Ahora se envía el tiempo individual del jugador 2!
        };

        console.log('Objeto aciertos Jugador 1 a enviar (payload):', aciertosJugador1Payload);
        console.log('Objeto aciertos Jugador 2 a enviar (payload):', aciertosJugador2Payload);

        this.aciertosService.createAcierto(aciertosJugador1Payload).subscribe({
          next: () => console.log('✅ Aciertos jugador 1 guardados'),
          error: err => console.error('❌ Error guardar aciertos jugador 1', err)
        });

        this.aciertosService.createAcierto(aciertosJugador2Payload).subscribe({
          next: () => console.log('✅ Aciertos jugador 2 guardados'),
          error: err => console.error('❌ Error guardar aciertos jugador 2', err)
        });
      },
      error: (err) => {
        console.error('❌ Error al guardar partida:', err);
        if (err.error && err.error.message) {
          console.error('Mensaje del servidor (partida):', err.error.message);
        }
        if (err.error && err.error.errors) {
          console.error('Detalles de errores de validación (partida):', err.error.errors);
        }
      }
    });
  }

  startTimer() {
    clearInterval(this.timerInterval); // Asegura que solo un intervalo esté corriendo
    this.timerInterval = setInterval(() => {
      if (this.showWinMessageFlag) {
        clearInterval(this.timerInterval); // Detiene el timer si el juego ha terminado
        return;
      }
      const playerKey = `player${this.currentPlayer}` as 'player1' | 'player2';
      this.gameStats[playerKey].time++; // Incrementa el tiempo del jugador actual
      this.totalGameTime++; // También incrementa el tiempo total del juego (opcional, para la partida)
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }
}
