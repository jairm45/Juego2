import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RegisterComponent } from './register.component';

@NgModule({
  imports: [
    FormsModule,
    RegisterComponent
  ],

  exports: [
    RegisterComponent
  ]
})
export class RegisterModule { }
