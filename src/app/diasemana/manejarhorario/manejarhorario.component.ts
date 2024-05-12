import {Component, OnInit} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {DatePipe, DecimalPipe, NgForOf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {Router, RouterOutlet} from "@angular/router";

interface Horario {
  Pessoa: string;
  Dia: string;
  Horario: string;
}

@Component({
  selector: 'app-manejarhorario',
  standalone: true,
  imports: [
    DatePipe,
    DecimalPipe,
    FormsModule,
    NgForOf,
    RouterOutlet
  ],
  templateUrl: './manejarhorario.component.html',
  styleUrl: './manejarhorario.component.scss'
})

export class ManejarhorarioComponent implements OnInit{
  dia!: string;
  horario!: string;
  horas!: { Horario: number; Dia: string; Pessoa: string }[];
  usuarioLogado!: string;
  profissional!: number;
  selectedHora!: { Horario: number; Dia: string; Pessoa: string } | null; // Adicionado para armazenar o horário selecionado

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  ngOnInit(): void {
    this.ObterHora();
    this.ObterUser();
    this.ObterDataAtual();
    console.log(this.usuarioLogado);
  }

  ObterDataAtual() {
    let dataAtual = new Date();
    let dia = ("0" + dataAtual.getUTCDate()).slice(-2); // Use getUTCDate() em vez de getDate()
    let mes = ("0" + (dataAtual.getUTCMonth() + 1)).slice(-2); // Use getUTCMonth() em vez de getMonth()
    let ano = dataAtual.getUTCFullYear(); // Use getUTCFullYear() em vez de getFullYear()
    this.dia = `${ano}-${mes}-${dia}`;
  }


  ObterHora() {
    this.httpClient.get<Horario[]>('http://localhost:3000/horarios').subscribe((nomes) => {
      this.horas = nomes.map(hora => ({...hora, Horario: parseInt(hora.Horario)}));
    });
  }

  selecionarHorario(horario: number) {
    this.horario = horario.toString();
  }

  ObterUser() {
    this.httpClient.get<{ nome: string, profissional: number}>('http://localhost:3000/usuario').subscribe(response => {
      this.usuarioLogado = response.nome;
      this.profissional = response.profissional;
    });
  }

  RemoverHora(hora?: { Horario: number; Dia: string; Pessoa: string }) { // Modificado para aceitar um parâmetro opcional
    if (hora) {
      this.horario = hora.Horario.toString();
      this.dia = hora.Dia;
    }

    if (!this.usuarioLogado || !this.dia || !this.horario) {
      window.alert('Por favor, faça login e selecione um dia e horário antes de remover um horário.');
      return;
    }
    if (!this.usuarioLogado || this.profissional != 1){
      window.alert("voce nao é administrador")
      this.router.navigate(['diasdasemana']);
      return;
    }

    let partes = this.dia.split('T')[0].split('-'); // Divida a string pela letra 'T' e pegue a primeira parte, que é a data
    let diaFormatado = `${partes[2]}/${partes[1]}/${partes[0]}`;

    this.httpClient.post('http://localhost:3000/removerhora', { pessoa: this.usuarioLogado, dia: diaFormatado, horario: this.horario })
      .subscribe(response => {
        console.log(response);
        // Atualize a lista de horários após adicionar um novo horário
        this.ObterHora();

      }, error => {
        console.error(error);
        if (error.error && error.error.message) {
          window.alert('Ocorreu um erro:  ' + error.error.message);
        } else {
          window.alert('Ocorreu um erro ao adicionar o horário');
        }
      });
  }

}
