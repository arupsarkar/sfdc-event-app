import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import {RouterModule} from '@angular/router';
import { CookieService} from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from './api.service';
import { CallbackComponent } from './callback/callback.component';
import { EventsComponent } from './events/events.component';
import {httpInterceptorProviders} from './http-interceptors';
import { AppRoutingModule} from './app-routing/app-routing.module';


// Define the routes

// const ROUTES = [
//   {
//     path: 'login',
//     component: LoginComponent
//   },
//   {
//     path: 'api/oauth2/callback',
//     component: CallbackComponent
//   },
//   {
//     path: 'events',
//     component: EventsComponent
//   }
// ];


@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    EventsComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
    // RouterModule.forRoot(ROUTES) // Add routes to the app
  ],
  providers: [ApiService, CookieService, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
