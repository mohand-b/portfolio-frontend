import { Routes } from '@angular/router';
import {HomeComponent} from "./home/containers/home/home.component";

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: '**',
    redirectTo: '',
  }
];
