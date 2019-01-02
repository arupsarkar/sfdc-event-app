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

  private secret: string;
  headings: Tile[] = [
    {text: 'Platform Event Integration', cols: 4, rows: 1, color: '#e3f2fd', disable: false}
  ];

  loginTiles: Tile[] = [
    {text: 'Platform Event Integration', cols: 1, rows: 1, color: '#e3f2fd', disable: false}
  ];
  logoutTiles: Tile[] = [
    {text: 'Platform Event Integration', cols: 1, rows: 1, color: '#e3f2fd', disable: false}
  ];
  middleSpaces: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#e3f2fd', disable: false}
  ];

  constructor( private apiService: ApiService,
               private messageService: MessageService,
               private cookieService: CookieService) {
    this.apiService.getConfig().subscribe( sfdcKey => {
      if (sfdcKey.secret !== undefined) {
        this.secret = sfdcKey.secret;
      }
    });
  }

  ngOnInit() {
    // Disable login once cookie value exists
    if (this.cookieService.get('access_token').length <  1) {
      this.loginTiles[0].disable = false;
      this.logoutTiles[0].disable = true;
    }

    // Disable logout once logout is successful.
    if (this.cookieService.get('access_token').length > 0) {
      this.loginTiles[0].disable = true;
      this.logoutTiles[0].disable = false;
    }
  }

  sfdcLogout(): void {
    this.apiService.logout().subscribe(logoutData => {
        if (logoutData.logout === 'success') {
          this.loginTiles[0].disable = false;
          this.logoutTiles[0].disable = true;
          window.location.href = location.origin;
        }
      },
      error => {
        this.log('Error logging out. Redirecting to the login page.');
        this.loginTiles[0].disable = true;
        this.logoutTiles[0].disable = false;
        window.location.href = location.origin;
      },
      () => {
          this.log('Logout process is now complete. You can close this browser tab.');
      });
  }

  sfdcLogin(): void {
    let sfdc_url = 'https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=';
    sfdc_url = sfdc_url + this.secret + '&redirect_uri=';
    sfdc_url = sfdc_url +  location.origin +  '/api/oauth2/callback';
    window.location.href = sfdc_url;
  }
  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Logout component : ${message}`);
  }
}
