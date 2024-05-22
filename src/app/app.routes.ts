import { Routes } from '@angular/router';
import {InicioComponent} from "./diasemana/inicio/inicio.component";
import {DiasComponent} from "./diasemana/dias/dias.component";
import {TelaloginComponent} from "./diasemana/telalogin/telalogin.component";
import {GerenciamentoComponent} from "./diasemana/gerenciamento/gerenciamento.component";


export const routes: Routes = [
  {
    path: "",
    component:TelaloginComponent,
  },
  {
    path: 'inicio', component: InicioComponent
  },
  {path: "dias",
  component:DiasComponent
    ,},
  {path:"gerenciamento",
  component:GerenciamentoComponent},
];
