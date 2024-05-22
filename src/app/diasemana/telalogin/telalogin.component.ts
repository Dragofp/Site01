import { Component } from '@angular/core';
import {Router, RouterLink, RouterOutlet} from "@angular/router";
import {FormsModule} from "@angular/forms";
import {SistemaLogin} from "../../../services/autenticacao.service";


@Component({
  selector: 'app-telalogin(naousada)',
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
  nomeRegistro: string = '';
  senhaRegistro: string = '';
  profissional: number = 0;

  nomeLogin: string = '';
  senhaLogin: string = '';

  constructor(private authService: SistemaLogin, private router: Router) { }


  registrarUsuario() {
    this.authService.registrar(this.nomeRegistro, this.senhaRegistro, this.profissional).subscribe(
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
    this.authService.login(this.nomeLogin, this.senhaLogin).subscribe(
      response => {
        console.log(response);
        alert('Login com sucesso!');
        this.router.navigate(['/menuparamudarpagina']);
      },
      error => {
        console.error(error);
        alert('Erro ao login!');
      }
    )}


}


