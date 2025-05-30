import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CartasComponent } from "./components/cartas/cartas.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CartasComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Juego';
}
