import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidaService {

  partidaURL = 'http://localhost:3000/partidas'

  constructor(private http: HttpClient) { }

  getPartidas(): Observable<any> {
    return this.http.get(this.partidaURL);
  }

  GetPartida(id: number): Observable<any> {
    return this.http.get(`${this.partidaURL}/${id}`);
  }

  GetCrearPartida(partida: any): Observable<any> {
    return this.http.post(this.partidaURL, partida);
  }
}
