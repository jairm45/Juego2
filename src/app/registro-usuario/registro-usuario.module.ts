import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegistroUsuarioComponent } from './registro-usuario.component';


@NgModule({
  imports: [
    FormsModule,
    RegistroUsuarioComponent

  ],

  exports: [
    RegistroUsuarioComponent
  ]
})
export class RegisterModule { }
