import { Routes } from '@angular/router';

import {ObternomeComponent} from "./obternome/obternome.component";
import {DiasdasemanaComponent} from "./diasemana/diasdasemana/diasdasemana.component";
import {SegundafeiraComponent} from "./diasemana/segundafeira/segundafeira.component";

export const routes: Routes = [
  {
    path: "obtenhanomes",
    component:ObternomeComponent
  },
  {
    path: "",
    component:DiasdasemanaComponent
  },
  {path: "segunda-feira",
  component:SegundafeiraComponent},
];
