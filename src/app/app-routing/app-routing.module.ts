import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import {LoginComponent} from '../login/login.component';
import {CallbackComponent} from '../callback/callback.component';
import {EventsComponent} from '../events/events.component';
import {EventDetailComponent} from '../event-detail/event-detail.component';
import {ContactsComponent} from '../contacts/contacts.component';

const ROUTES = [
  // {path: '', redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'api/oauth2/callback', component: CallbackComponent},
  {path: 'events', component: EventsComponent},
  {path: 'event-detail/:fullName', component: EventDetailComponent},
  {path: 'contacts', component: ContactsComponent}
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
