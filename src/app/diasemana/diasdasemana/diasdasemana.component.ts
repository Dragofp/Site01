import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-diasdasemana',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,CommonModule,
  ],
  providers:[],
  templateUrl: './diasdasemana.component.html',
  styleUrl: './diasdasemana.component.scss'
})
export class DiasdasemanaComponent {

}

