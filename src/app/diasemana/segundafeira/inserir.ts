import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Inserir {
  constructor(private http: HttpClient) { }

  inserirNome(nome: string) {
    return this.http.post('http://localhost:3000/api/inserir-nome', { nome });
  }
}
