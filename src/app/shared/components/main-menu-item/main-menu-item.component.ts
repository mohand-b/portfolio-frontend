import {Component, Input} from '@angular/core';
import {MenuItem} from "../main-menu/main-menu.component";
import {RouterLink, RouterLinkActive} from "@angular/router";

@Component({
  selector: 'app-main-menu-item',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './main-menu-item.component.html',
  styleUrl: './main-menu-item.component.scss'
})
export class MainMenuItemComponent {

  @Input() menuItem!: MenuItem;

}
