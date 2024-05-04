import { Component } from '@angular/core';
import {ObternomeComponent} from "../../obternome/obternome.component";
import {Inserir} from "./inserir";
import {CommonModule} from "@angular/common";
import {FormsModule} from "@angular/forms";


@Component({
  selector: 'app-segundafeira',
  standalone: true,
  imports: [
    ObternomeComponent,CommonModule,FormsModule
  ],
  providers: [Inserir],
  templateUrl: './segundafeira.component.html',
  styleUrl: './segundafeira.component.scss'
})
export class SegundafeiraComponent {
  nome: string;
  constructor(private nomeService: Inserir) {
    this.nome = '';
  }

  inserirNome() {
    this.nomeService.inserirNome(this.nome).subscribe(res => {
      console.log(res);
    }, err => {
      console.error(err);
    });
  }
}


