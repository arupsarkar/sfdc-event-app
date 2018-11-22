import { Component, OnInit } from '@angular/core';
// import event service
import { EventServiceService} from '../event-service.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public results: OAuthCreds[];

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
        console.log('DEBUG: LoginComponent token : ', this.results.login[0].token);
        console.log('DEBUG: LoginComponent instanceURL : ', this.results.login[1].instanceURL);
      });

  }
}
