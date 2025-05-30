import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  constructor(private router: Router) {}

  startGame(jugadores: number): void {
    this.createHearts(); // Agrega corazones flotantes

    setTimeout(() => {
      if (jugadores === 1) {
        this.router.navigate(['/juego']);
      } else if (jugadores === 2) {
        this.router.navigate(['/registro']);
      }
    }, 300); // Pequeña pausa para ver los corazones
  }

  createHearts(): void {
    const emojis = ['💖', '💕', '💗', '💓', '💝'];
    const buttons = document.querySelectorAll('button');

    buttons.forEach(button => {
      const rect = button.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      for (let i = 0; i < 6; i++) {
        setTimeout(() => {
          const heart = document.createElement('div');
          heart.className = 'heart';
          heart.innerHTML = emojis[Math.floor(Math.random() * emojis.length)];
          heart.style.left = (centerX + (Math.random() - 0.5) * 100) + 'px';
          heart.style.top = centerY + 'px';
          heart.style.position = 'absolute';
          heart.style.fontSize = '1.5rem';
          heart.style.color = '#ff69b4';
          heart.style.opacity = '1';
          heart.style.pointerEvents = 'none';
          heart.style.animation = 'float-heart 3s ease-out';
          heart.style.zIndex = '9999';

          document.body.appendChild(heart);

          setTimeout(() => {
            heart.remove();
          }, 3000);
        }, i * 100);
      }
    });
  }

}
