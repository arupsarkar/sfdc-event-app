import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Params} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-callback',
  templateUrl: './callback.component.html',
  styleUrls: ['./callback.component.css']
})
export class CallbackComponent implements OnInit {
  public token: any;
  private tokenUrlParams: String;
  private accessToken: string;
  constructor(private route: ActivatedRoute, private cookieService: CookieService) {
    console.log('DEBUG: CallbackComponent constructor --Start');
  }

  ngOnInit() {

    this.token = this.route.params.pipe().subscribe( (params: Params) => console.log(this.route.snapshot.fragment));
    this.tokenUrlParams = `${this.route.snapshot.fragment}`;
    const toArray = this.tokenUrlParams.split('&');
    console.log(toArray);
    for (const token of toArray) {
      console.log(' >>>>> ' , token);
      const params = token.split('=');
        if (params[0] === 'access_token') {
          this.cookieService.set('access_token', params[1]);
        } else if ( params[0] === 'instance_url' ) {
          this.cookieService.set('instance_url', params[1]);
        }
    }
    console.log('access_token', this.cookieService.get('access_token'));
    console.log('instance_url', this.cookieService.get('instance_url'));
  }
}
