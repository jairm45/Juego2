import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuariosService {

  usuariosURL = 'http://localhost:3000/usuarios'

  constructor( private http: HttpClient) { }

   getUsuarios(){
     return this.http.get(this.usuariosURL);
   }

   getUsuario(id: number): Observable<any>{
     return this.http.get(`${this.usuariosURL}/${id}`);
   }

}
