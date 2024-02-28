import {Component} from '@angular/core';
import {MainMenuItemComponent} from "../main-menu-item/main-menu-item.component";
import {NgForOf} from "@angular/common";
import {RouterLink} from "@angular/router";
import {routes} from "../../../app.routes";

export interface MenuItem {
  title: string;
  path: string;
}

@Component({
  selector: 'app-main-menu',
  standalone: true,
  imports: [
    MainMenuItemComponent,
    NgForOf,
    RouterLink
  ],
  templateUrl: './main-menu.component.html',
  styleUrl: './main-menu.component.scss'
})
export class MainMenuComponent {

  menuItems: MenuItem[] = routes.filter(route => route.title).map(route => ({
    title: route.title,
    path: route.path
  })) as MenuItem[];

}
