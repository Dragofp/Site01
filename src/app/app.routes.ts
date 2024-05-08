import { Routes } from '@angular/router';
import {DiasdasemanaComponent} from "./diasemana/diasdasemana/diasdasemana.component";
import {SegundafeiraComponent} from "./diasemana/segundafeira/segundafeira.component";
import {TelaloginComponent} from "./telalogin/telalogin.component";


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
];
