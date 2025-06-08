import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JuegosService {

  juegosURL = 'http://localhost:3000/juegos';

  constructor( private http: HttpClient) { }

  getJuegos(){
    return this.http.get(this.juegosURL);
  }

  getJuego(id: number): Observable<any>{
    return this.http.get(`${this.juegosURL}/${id}`);
  }
}
