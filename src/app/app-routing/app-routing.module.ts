import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LoginComponent} from '../login/login.component';
import {CallbackComponent} from '../callback/callback.component';
import {EventsComponent} from '../events/events.component';

const ROUTES = [
  // {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'api/oauth2/callback', component: CallbackComponent},
  {path: 'events', component: EventsComponent}
];


@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    RouterModule.forRoot(ROUTES)
  ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}