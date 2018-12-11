import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

import { ApiService } from '../api.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import { MessageService} from '../message.service';


export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  disable: boolean;
}


@Component({
  selector: 'app-login',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  headings: Tile[] = [
    {text: 'Platform Event Integration', cols: 4, rows: 1, color: '#344955', disable: false}
  ];

  loginTiles: Tile[] = [
    {text: 'Platform Event Integration', cols: 1, rows: 1, color: '#344955', disable: false}
  ];
  logoutTiles: Tile[] = [
    {text: 'Platform Event Integration', cols: 1, rows: 1, color: '#344955', disable: false}
  ];
  middleSpaces: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#344955', disable: false}
  ];

  constructor( private apiService: ApiService,
               private messageService: MessageService,
               private cookieService: CookieService) {
    console.log('DEBUG: LoginComponent: ', 'Inside LoginComponent constructor ');
  }

  ngOnInit() {
    // Disable login once cookie value exists
    if (this.cookieService.get('access_token') !== undefined) {
      this.loginTiles[0].disable = true;
      this.logoutTiles[0].disable = false;
    }

    // Disable logout once logout is successful.
    if (this.cookieService.get('access_token') === undefined) {
      this.loginTiles[0].disable = false;
      this.logoutTiles[0].disable = true;
    }
  }

  sfdcLogout(): void {
    this.apiService.logout().subscribe(logoutData => {
      this.log(JSON.stringify(logoutData));
      if (logoutData.logout === 'success') {

        this.loginTiles[0].disable = false;
        this.logoutTiles[0].disable = true;
        window.location.href = location.origin;
      }
    });
  }

  sfdcLogin(): void {
    let sfdc_url = 'https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=';
    sfdc_url = sfdc_url + '3MVG9zlTNB8o8BA2wrVtTcGwhEwLCayBmMKJEF6uILig.M9wPX3IHZTlE8W7OsJKeJ0Mc0cHvIPF_p_bmMAXx&redirect_uri=';
    sfdc_url = sfdc_url +  location.origin +  '/api/oauth2/callback';
    console.log('DEBUG: LoginComponent: ', 'Login button clicked..');
    console.log('DEBUG: LoginComponent: Location ', location);
    console.log('DEBUG: LoginComponent: protocol ', location.protocol);
    console.log('DEBUG: LoginComponent: host ', location.host);
    console.log('DEBUG: LoginComponent: port ', location.port);
    console.log('DEBUG: LoginComponent: window.location.href ', window.location.href);
    window.location.href = sfdc_url;
  }
  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Logout component : ${message}`);
  }
}
