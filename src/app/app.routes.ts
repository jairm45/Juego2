import { Routes } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { MemoryGameComponent } from './memory-game/memory-game.component';
import { RegisterComponent } from './register/register.component';
import { RegistroUsuarioComponent } from './registro-usuario/registro-usuario.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'registro', component: RegisterComponent },
  { path: 'juego', component: MemoryGameComponent },
  { path: 'registrousuario', component: RegistroUsuarioComponent },




];
