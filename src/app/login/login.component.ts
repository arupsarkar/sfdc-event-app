import { Component, OnInit } from '@angular/core';
// import event service
import { EventServiceService} from '../event-service.service';
import {LoginOAuth} from '../model/LoginOAuth';
import { ApiService } from '../api.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    results: LoginOAuth[];
    loginCreds: any[];
  constructor(private eventService: EventServiceService, private apiService: ApiService) {
    console.log('DEBUG: LoginComponent: ', 'Inside LoginComponent constructor ');
  }

  ngOnInit() {
  }

  sfdcLogin(): void {
    console.log('DEBUG: LoginComponent: ', 'Login button clicked..');
      // this.eventService.login().subscribe( data => {
      //   // this.results = data.login[0].token;
      //   this.results = data;
      //   console.log('DEBUG: LoginComponent token : ', this.results);
      //   console.log('DEBUG: LoginComponent instanceURL : ', this.results);
      // });
    this.apiService.login().subscribe( data => { console.log( data ); });

  }
}
