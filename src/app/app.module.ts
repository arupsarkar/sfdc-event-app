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
import { EventDetailComponent } from './event-detail/event-detail.component';
import {FormsModule} from '@angular/forms';
import { MaterialModule} from './material/material.module';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    CallbackComponent,
    EventsComponent,
    MessagesComponent,
    EventDetailComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    MaterialModule
  ],
  providers: [ApiService, CookieService, httpInterceptorProviders],
  bootstrap: [AppComponent]
})
export class AppModule { }
