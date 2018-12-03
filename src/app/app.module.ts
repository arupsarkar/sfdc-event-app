import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CookieService} from 'ngx-cookie-service';

import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { ApiService } from './api.service';
import { CallbackComponent } from './callback/callback.component';
import { EventsComponent } from './events/events.component';
import {httpInterceptorProviders} from './http-interceptors';
import { AppRoutingModule} from './app-routing/app-routing.module';
import { MessagesComponent } from './messages/messages.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    EventsComponent,
    MessagesComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [ApiService, CookieService, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
