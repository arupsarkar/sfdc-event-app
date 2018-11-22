import { Component, OnInit } from '@angular/core';
// import event service
import { EventServiceService} from '../event-service.service';
import {LoginOAuth} from '../model/LoginOAuth';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
    results: LoginOAuth[];

  constructor(private eventService: EventServiceService) {
    console.log('DEBUG: LoginComponent: ', 'Inside LoginComponent constructor ');
  }

  ngOnInit() {
  }

  sfdcLogin(): void {
    console.log('DEBUG: LoginComponent: ', 'Login button clicked..');
      this.eventService.login().subscribe( data => {
        // this.results = data.login[0].token;
        this.results = data;
        console.log('DEBUG: LoginComponent token : ', this.results);
        console.log('DEBUG: LoginComponent instanceURL : ', this.results);
      });

  }
}
