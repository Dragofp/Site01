import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SistemaLogin} from "../../services/autenticacao.service";


@Component({
  selector: 'app-telalogin',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    FormsModule,
  ],
  templateUrl: './telalogin.component.html',
  styleUrl: './telalogin.component.scss'
})
export class TelaloginComponent {
  nome: string = '';
  senha: string = '';
  profissional: number = 0;

  constructor(private authService: SistemaLogin, private router: Router) { }


  registrarUsuario() {
    this.authService.registrar(this.nome, this.senha, this.profissional).subscribe(
      response => {
        console.log(response);
        alert('Registrado com sucesso!');
      },
      error => {
        console.error(error);
        alert('Erro ao registrar!');
      }
    )};

  loginUsuario() {
    this.authService.login(this.nome, this.senha).subscribe(
      response => {
        console.log(response);
        alert('Login com sucesso!');
        this.router.navigate(['/diasdasemana']);
      },
      error => {
        console.error(error);
        alert('Erro ao login!');
      }
    )}


};


