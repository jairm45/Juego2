import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';


@Component({
  selector: 'app-registro-usuario',
  templateUrl: './registro-usuario.component.html',
  styleUrls: ['./registro-usuario.component.css']
})
export class RegistroUsuarioComponent implements OnInit {

  formulario!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.formulario = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
      juegoId: ['', Validators.required]
    });
  }

  registrarUsuario() {
    if (this.formulario.valid) {
      const datosUsuario = this.formulario.value;
      console.log('Datos registrados:', datosUsuario);
      // Aquí podés enviar los datos al backend con HttpClient
    }
  }
}
