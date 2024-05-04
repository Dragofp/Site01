import { Component } from '@angular/core';
import {ObternomeComponent} from "./obternome/obternome.component";
import {BrowserModule} from "@angular/platform-browser";
import {CommonModule} from "@angular/common";
import {RouterOutlet} from "@angular/router";


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ObternomeComponent,RouterOutlet], // Add FormsModule to imports
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  providers: [CommonModule,BrowserModule]
})
export class AppComponent {
  title = 'landing';
}
