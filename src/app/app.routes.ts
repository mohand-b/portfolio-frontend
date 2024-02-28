import {Routes} from '@angular/router';
import {HomeComponent} from "./home/containers/home/home.component";
import {CareerComponent} from "./career/containers/career/career.component";
import {ContactComponent} from "./contact/containers/contact/contact.component";
import {ProjectsComponent} from "./projects/containers/projects/projects.component";

export const routes: Routes = [
  {
    path: 'about-me',
    component: HomeComponent,
    title: 'About Me'
  },
  {
    path: 'career',
    component: CareerComponent,
    title: 'Career'
  },
  {
    path: 'contact',
    component: ContactComponent,
    title: 'Contact'
  },
  {
    path: 'projects',
    component: ProjectsComponent,
    title: 'Projects'
  },
  {
    path: '**',
    redirectTo: 'about-me',
  }
];
