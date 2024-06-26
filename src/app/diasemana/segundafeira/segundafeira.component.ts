import {Component, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
interface Horario {
  Pessoa: string;
  Dia: string;
  Horario: string;
}

@Component({
  selector: 'app-segundafeira',
  standalone: true,
  imports: [
    CommonModule,FormsModule
  ],
  providers: [],
  templateUrl: './segundafeira.component.html',
  styleUrl: './segundafeira.component.scss'
})
export class SegundafeiraComponent implements OnInit {
  dia!: string;
  horario!: string;
  horas!: { Horario: number; Dia: string; Pessoa: string }[];
  usuarioLogado!: string;

  constructor(private httpClient: HttpClient) {
  }
  selecionarHorario(horario: number) {
    this.horario = horario.toString();
  }

  ngOnInit(): void {
    this.ObterHora();
    this.ObterUser();
    this.ObterDataAtual();
    console.log(this.usuarioLogado);
  }
  ObterDataAtual() {
    let dataAtual = new Date();
    let dia = ("0" + dataAtual.getDate()).slice(-2);
    let mes = ("0" + (dataAtual.getMonth() + 1)).slice(-2);
    let ano = dataAtual.getFullYear();

    this.dia = `${ano}-${mes}-${dia}`;
  }
  ObterHora() {
    this.httpClient.get<Horario[]>('http://localhost:3000/horarios').subscribe((nomes) => {
      this.horas = nomes.map(hora => ({...hora, Horario: parseInt(hora.Horario)}));
    });
  }

  ObterUser() {
    this.httpClient.get<{ nome: string }>('http://localhost:3000/usuario').subscribe(response => {
      this.usuarioLogado = response.nome;
    });
  }

  InserirHora() {
    if (!this.usuarioLogado || !this.dia || !this.horario) {
      window.alert('Por favor, faça login e selecione um dia e horário antes de adicionar um horário.');
      return;
    }

    let partes = this.dia.split('-');
    let diaFormatado = `${partes[2]}/${partes[1]}/${partes[0]}`;

    this.httpClient.post('http://localhost:3000/addhora', { pessoa: this.usuarioLogado, dia: diaFormatado, horario: this.horario })
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



