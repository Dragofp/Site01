import { Routes } from '@angular/router';
import {DiasdasemanaComponent} from "./diasemana/diasdasemana/diasdasemana.component";
import {SegundafeiraComponent} from "./diasemana/segundafeira/segundafeira.component";
import {TelaloginComponent} from "./diasemana/telalogin/telalogin.component";
import {ManejarhorarioComponent} from "./diasemana/manejarhorario/manejarhorario.component";


export const routes: Routes = [
  {
    path: "",
    component:TelaloginComponent,
  },
  {
    path: 'diasdasemana', component: DiasdasemanaComponent
  },
  {path: "segunda-feira",
  component:SegundafeiraComponent
    ,},
  {path:"removerhora",
  component:ManejarhorarioComponent},
];
