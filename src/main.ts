import {bootstrapApplication} from '@angular/platform-browser';
import {AppComponent} from './app/app.component';
import {provideHttpClientTesting} from "@angular/common/http/testing";
import {provideRouter} from "@angular/router";
import {provideAnimations} from "@angular/platform-browser/animations";
import {routes} from "./app/app.routes";
import {provideHttpClient, withInterceptorsFromDi} from "@angular/common/http";
import {LOCALE_ID} from "@angular/core";
import {registerLocaleData} from '@angular/common';
import localeFr from '@angular/common/locales/fr';

registerLocaleData(localeFr);
bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClientTesting(),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptorsFromDi()),
    {provide: LOCALE_ID, useValue: 'fr-FR'},
  ],
}).catch((err) => console.error(err));
