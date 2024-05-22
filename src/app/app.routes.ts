import { Routes } from '@angular/router';
import {InicioComponent} from "./diasemana/menuparamudarpagina/inicio.component";
import {DiasComponent} from "./diasemana/telaparainserirhorario/dias.component";
import {TelaloginComponent} from "./diasemana/telalogin/telalogin.component";
import {GerenciamentoComponent} from "./diasemana/telapararemoverhorario/gerenciamento.component";


export const routes: Routes = [
  {
    path: "",
    component:TelaloginComponent,
  },
  {
    path: 'menuparamudarpagina', component: InicioComponent
  },
  {path: "telaparainserirhorario",
  component:DiasComponent
    ,},
  {path:"telapararemoverhorario",
  component:GerenciamentoComponent},
];
