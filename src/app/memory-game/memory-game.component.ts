import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Partida } from '../models/partida.model';
import { Usuario } from '../models/usuario.model';
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

  jugador1: Usuario = { id: 0, username: '', password: '', email: '', idjuego: 0 };
  jugador2: Usuario = { id: 0, username: '', password: '', email: '', idjuego: 0 };

  gameStats = {
    player1: { moves: 0, pairs: 0, time: 0 },
    player2: { moves: 0, pairs: 0, time: 0 }
  };

  timerInterval: any;
  totalGameTime: number = 0;
  showWinMessageFlag: boolean = false;
  winner: number | null = null;
  winnerText: string = '';

  juegoListObject?: any = [];

  constructor(
    private juegosService: JuegosService,
    private partidaService: PartidaService,
    private aciertosService: AciertosService,
    private router: Router
  ) {}

  ngOnInit() {
    this.juegosService.getJuegos().subscribe(data => this.juegoListObject = data);

    const jugador1Data = localStorage.getItem('jugador1');
    const jugador2Data = localStorage.getItem('jugador2');

    if (jugador1Data && jugador2Data) {
      this.jugador1 = JSON.parse(jugador1Data);
      this.jugador2 = JSON.parse(jugador2Data);
    } else {
      console.error('Jugadores no encontrados. Redirige al registro si es necesario.');
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
    this.totalGameTime = 0;

    this.gameStats.player1 = { moves: 0, pairs: 0, time: 0 };
    this.gameStats.player2 = { moves: 0, pairs: 0, time: 0 };

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
      this.winnerText = `¡${this.jugador1.username} gana! 🎉`;
    } else if (this.gameStats.player2.pairs > this.gameStats.player1.pairs) {
      this.winner = ganador = 2;
      this.winnerText = `¡${this.jugador2.username} gana! 🎉`;
    } else {
      this.winner = 0;
      this.winnerText = '¡Empate!';
    }

    clearInterval(this.timerInterval);

    const partida: Partida = {
      id: 0, // El backend lo genera
      jugador1: this.jugador1.id,
      jugador2: this.jugador2.id,
      tiempo: this.formatTime(this.totalGameTime),
      ganador: ganador,
      juego: this.jugador1.idjuego, // Asumimos que ambos jugadores tienen el mismo juego
      Aciertosjugador1: this.gameStats.player1.pairs,
      Aciertosjugador2: this.gameStats.player2.pairs
    };

    this.partidaService.GetCrearPartida(partida).subscribe({
      next: (res: any) => {
        console.log('✅ Partida guardada:', res);

        const partidaId = res.id;

        const aciertosJugador1 = {
          partidaid: partidaId,
          usuarioid: this.jugador1.id,
          aciertos: this.gameStats.player1.pairs,
          tiempo: this.formatTime(this.gameStats.player1.time)
        };

        const aciertosJugador2 = {
          partidaid: partidaId,
          usuarioid: this.jugador2.id,
          aciertos: this.gameStats.player2.pairs,
          tiempo: this.formatTime(this.gameStats.player2.time)
        };

        this.aciertosService.GetCrearAciertos(aciertosJugador1).subscribe({
          next: () => console.log('✅ Aciertos jugador 1 guardados'),
          error: err => console.error('❌ Error guardar aciertos jugador 1', err)
        });

        this.aciertosService.GetCrearAciertos(aciertosJugador2).subscribe({
          next: () => console.log('✅ Aciertos jugador 2 guardados'),
          error: err => console.error('❌ Error guardar aciertos jugador 2', err)
        });
      },
      error: (err) => console.error('❌ Error al guardar partida:', err)
    });
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.showWinMessageFlag) return;

      this.totalGameTime++;

      if (this.currentPlayer === 1) {
        this.gameStats.player1.time++;
      } else {
        this.gameStats.player2.time++;
      }
    }, 1000);
  }

  formatTime(seconds: number): string {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  }
}
