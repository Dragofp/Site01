import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SistemaLogin {

  constructor(private http: HttpClient) { }

  registrar(nome: string, senha: string, profissional: number) {
    return this.http.post('http://localhost:3000/registrar', { nome, senha, profissional });
  }

  login(nome: string, senha: string) {
    return this.http.post('http://localhost:3000/login', { nome, senha });
  }

}
