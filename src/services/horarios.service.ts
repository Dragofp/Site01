import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HorariosService {
  private endpointurl = 'http://localhost:3000/horarios'; // Sua URL do servidor

  constructor(private http: HttpClient) { }

  getHorarios() {
    return this.http.get(this.endpointurl);
  }
  postHorario(nome: string, dia: string, horario: string): Observable<any> {
    // Formatar a data
    let diaFormatado = dia.split("/").reverse().join("-");

    const body = { pessoa: nome, dia: diaFormatado, horario: horario };
    return this.http.post('http://localhost:3000/addhora', body);
  }
}
