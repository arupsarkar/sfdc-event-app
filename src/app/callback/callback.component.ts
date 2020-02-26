import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router, Params} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { MessageService} from '../message.service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  public token: any;
  private tokenUrlParams: String;
  private accessToken: string;
  constructor(private route: ActivatedRoute,
              private router: Router,
              private cookieService: CookieService,
              private messageService: MessageService) {
  }

  gotoEvents(accessToken: string, instanceUrl: string) {
    // this.router.navigate(['/events', {access_token: accessToken, instance_url: instanceUrl}]);
    if ( accessToken !== undefined && instanceUrl !== undefined) {
      this.log( 'Login success');
    }
    this.router.navigate(['/landing']).then(r => { console.log(new Date(), 'redirecting to landing page ' + r ); });
    // this.router.navigate(['/contacts']).then(r => console.log(new Date(), 'Navigating to contacts'));
  }
  ngOnInit() {

    this.token = this.route.params.pipe().subscribe(
      (params: Params) => {
        // If required log some output to the message broker
        // or console for testing.
      },
      error => {
        // If required log some output to the message broker
        // or console for testing.
        this.log(`${error}`);
      },
      () => {}
    );
    this.tokenUrlParams = `${this.route.snapshot.fragment}`;
    const toArray = this.tokenUrlParams.split('&');
    for (const token of toArray) {
      const params = token.split('=');
        if (params[0] === 'access_token') {
          this.cookieService.set('access_token', params[1]);
        } else if ( params[0] === 'instance_url' ) {
          this.cookieService.set('instance_url', params[1]);
        }
    }
    this.gotoEvents(this.cookieService.get('access_token'), this.cookieService.get('instance_url'));
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    const d = new Date();
    const datePart = d.toLocaleDateString();
    const timePart = d.toLocaleTimeString();
    const finalDateTime = datePart + ' ' + timePart;
    this.messageService.add(`${finalDateTime} : Callback component : ${message}`);
  }
}
