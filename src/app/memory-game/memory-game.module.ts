import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MemoryGameComponent } from './memory-game.component';

@NgModule({
  imports: [
    FormsModule,
     MemoryGameComponent,
     CommonModule
  ],


  exports: [
    MemoryGameComponent
  ]
})
export class RegisterModule { }
