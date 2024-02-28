import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {MainMenuComponent} from "./shared/components/main-menu/main-menu.component";
import {HeaderComponent} from "./shared/components/header/header.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MainMenuComponent, HeaderComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'portfolio-frontend';
}
