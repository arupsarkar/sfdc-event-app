import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ApiService } from '../api.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  constructor(private route: ActivatedRoute, private  apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getEvents().subscribe( data => { console.log( data ); });
  }

  publishEvents() {
    console.log('DEBUG: Publish Events', 'Start');
    console.log('DEBUG: Publish Events', 'End');
    this.apiService.eventsPublish().subscribe( data => {console.log( data ); });
  }
}
