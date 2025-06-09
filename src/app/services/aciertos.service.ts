import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AciertosService {

  aciertosURL = 'http://localhost:3000/aciertos'

  constructor(private http: HttpClient) { }

  getAciertos(): Observable<any> {
    return this.http.get(this.aciertosURL);
  }

  GetAciertos(id: number): Observable<any> {
    return this.http.get(`${this.aciertosURL}/${id}`);
  }

  GetCrearAciertos(aciertos: any): Observable<any> {
    return this.http.post(this.aciertosURL, aciertos);
  }

}
