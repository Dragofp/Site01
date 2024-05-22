import {Component, inject} from '@angular/core';
import {RouterLink, RouterLinkActive, RouterOutlet} from "@angular/router";
import {CommonModule} from "@angular/common";


@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet,CommonModule,
  ],
  providers:[],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.scss'
})
export class InicioComponent {

}

