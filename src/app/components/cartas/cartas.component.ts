import { Component, OnInit } from '@angular/core';
import { NgClass } from '@angular/common';

interface Card {
  symbol: string;
  flipped: boolean;
  matched: boolean;
}

@Component({
  selector: 'app-cartas',
  imports: [NgClass],
  templateUrl: './cartas.component.html',
  styleUrls: ['./cartas.component.css']
})
export class CartasComponent implements OnInit {
  cardSymbols = ['❤️', '🥚', '🌸', '☁️', '☀️', '🌈', '🍄', '🍦'];
  cards: Card[] = [];
  flippedCards: number[] = [];
  matchedPairs = 0;
  moves = 0;
  time = 0;
  intervalId: any = null;
  gameActive = false;
  showWin = false;

  ngOnInit(): void {
    this.resetGame();
  }

  shuffle<T>(array: T[]): T[] {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  startTimer() {
    this.time = 0;
    this.intervalId = setInterval(() => this.time++, 1000);
  }

  get formattedTime(): string {
    const minutes = Math.floor(this.time / 60).toString().padStart(2, '0');
    const seconds = (this.time % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  flipCard(index: number) {
    if (!this.gameActive) {
      this.gameActive = true;
      this.startTimer();
    }

    const card = this.cards[index];
    if (card.flipped || card.matched || this.flippedCards.length >= 2) return;

    card.flipped = true;
    this.flippedCards.push(index);

    if (this.flippedCards.length === 2) {
      this.moves++;
      setTimeout(() => this.checkMatch(), 800);
    }
  }

  checkMatch() {
    const [i1, i2] = this.flippedCards;
    const card1 = this.cards[i1];
    const card2 = this.cards[i2];

    if (card1.symbol === card2.symbol) {
      card1.matched = card2.matched = true;
      this.matchedPairs++;
      if (this.matchedPairs === this.cardSymbols.length) {
        clearInterval(this.intervalId);
        this.showWin = true;
      }
    } else {
      card1.flipped = false;
      card2.flipped = false;
    }

    this.flippedCards = [];
  }

  resetGame() {
    this.cards = this.shuffle(
      [...this.cardSymbols, ...this.cardSymbols].map(symbol => ({
        symbol,
        flipped: false,
        matched: false
      }))
    );
    this.flippedCards = [];
    this.matchedPairs = 0;
    this.moves = 0;
    this.gameActive = false;
    this.showWin = false;
    if (this.intervalId) clearInterval(this.intervalId);
    this.time = 0;
  }
}
