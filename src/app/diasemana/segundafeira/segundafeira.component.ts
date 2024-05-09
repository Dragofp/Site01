import {ChangeDetectorRef, Component, inject, OnInit} from '@angular/core';
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {HorariosService} from "../../../services/horarios.service";
import {RouterOutlet} from "@angular/router";
import {Observable} from "rxjs";



@Component({
  selector: 'app-segundafeira',
  standalone: true,
  imports: [
    CommonModule, FormsModule, RouterOutlet
  ],
  providers: [HorariosService],
  templateUrl: './segundafeira.component.html',
  styleUrl: './segundafeira.component.scss'
})
export class SegundafeiraComponent implements OnInit {
  nome!: string;
  horario!: string;
  dia!: string;
  horas!: any[];

  constructor(private httpClient: HorariosService) { }

  ngOnInit(): void {
    this.ObterHora();
  }

  ObterHora(){
    this.httpClient.getHorarios().subscribe((nomes:any) => {
      this.horas = nomes;
    });
  }

  InserirHora(){
    this.httpClient.postHorario(this.nome, this.dia, this.horario).subscribe(response => {
      console.log(response);
      // Aqui você pode adicionar o que deve ser feito após a inserção bem-sucedida do horário.
      this.ObterHora(); // Atualiza a lista de horários após a inserção
    }, error => {
      console.error(error);
      // Aqui você pode adicionar o que deve ser feito se ocorrer um erro ao inserir o horário.
    });
  }
}
