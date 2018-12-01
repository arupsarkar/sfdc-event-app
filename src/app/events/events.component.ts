import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import { CookieService } from 'ngx-cookie-service';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private cookieService: CookieService, private  apiService: ApiService) { }

  ngOnInit() {
    console.log('access_token', this.cookieService.get('access_token'));
    console.log('instance_url', this.cookieService.get('instance_url'));
    this.apiService.getEvents().subscribe( data => { console.log( data ); });
  }

}
