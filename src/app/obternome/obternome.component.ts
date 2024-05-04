import {Component, inject, OnInit} from '@angular/core';
import {HttpClientModule} from "@angular/common/http";
import {Lernomes} from "./lernomeserv";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";

@Component({
  selector: 'obternome',
  standalone: true,
  imports: [CommonModule,HttpClientModule,FormsModule,ReactiveFormsModule],
  templateUrl: './obternome.component.html',
  styleUrls: ['./obternome.component.scss'],
  providers:[Lernomes],
})
export class ObternomeComponent implements OnInit {
  httpClient = inject(Lernomes);
  nomes: any[] = [];
  ngOnInit(): void {
    this.ObterNome();
  }

  ObterNome(){
    this.httpClient.obterNome().subscribe((nomes:any) => {
      this.nomes = nomes;
    });
  }
}
