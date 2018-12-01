import { Component, OnInit } from '@angular/core';
// import event service
import { EventServiceService} from '../event-service.service';
import {LoginOAuth} from '../model/LoginOAuth';
import { ApiService } from '../api.service';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';


@Component({
  selector: 'app-login',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    results: LoginOAuth[];
    location: Location;
  constructor(private eventService: EventServiceService, private apiService: ApiService) {
    console.log('DEBUG: LoginComponent: ', 'Inside LoginComponent constructor ');
  }

  ngOnInit() {
  }

  supplant(str, data): String {
    return str.replace(/{([^{}]*)}/g, function (a, b) {

      // Split the variable into its dot notation parts
      let p = b.split(/\./);

      // The c variable becomes our cursor that will traverse the object
      let c = data;

      // Loop over the steps in the dot notation path
      for (let i = 0; i < p.length; ++i) {

        // If the key doesn't exist in the object do not process
        // mirrors how the function worked for bad values
        if (c[p[i]] == null) {
          return a;
        }
        // Move the cursor up to the next step
        c = c[p[i]];
      }

      // If the data is a string or number return it otherwise do
      // not process, return the value it was, i.e. {x}
      return typeof c === 'string' || typeof c === 'number' ? c : a;
    });
  }

  sfdcLogin(): void {
    const sfdc_url = 'https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id=3MVG9zlTNB8o8BA2wrVtTcGwhEwLCayBmMKJEF6uILig.M9wPX3IHZTlE8W7OsJKeJ0Mc0cHvIPF_p_bmMAXx&redirect_uri=https://sfdc-event-app.herokuapp.com/api/oauth2/callback';
    console.log('DEBUG: LoginComponent: ', 'Login button clicked..');
    console.log('DEBUG: LoginComponent: Location ', location);
    console.log('DEBUG: LoginComponent: protocol ', location.protocol);
    console.log('DEBUG: LoginComponent: host ', location.host);
    console.log('DEBUG: LoginComponent: port ', location.port);
    console.log('DEBUG: LoginComponent: window.location.href ', window.location.href);
    window.location.href = sfdc_url;
      // this.eventService.login().subscribe( data => {
      //   // this.results = data.login[0].token;
      //   this.results = data;
      //   console.log('DEBUG: LoginComponent token : ', this.results);
      //   console.log('DEBUG: LoginComponent instanceURL : ', this.results);
      // });
    // this.apiService.login().subscribe( data => { console.log( data ); });

  }
}
