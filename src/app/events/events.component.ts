import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ApiService } from '../api.service';
import { Event} from '../model/Event';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  message = '';
  events: Event[];
  constructor(private route: ActivatedRoute, private  apiService: ApiService) { }

  ngOnInit() {
    this.apiService.getEvents().subscribe( events => this.events = events );
  }

  publishEvents() {
    console.log('DEBUG: Publish Events', 'Start');
    console.log('DEBUG: Publish Events', 'End');
    // this.apiService.eventsPublish().subscribe(
    //                                     data => {
    //                                           this.message = JSON.stringify(data);
    //                                           console.log( 'DEBUG: Event Component : ', data ); },
    //                                     response => {console.log('POST call in error', response); },
    //                                   () => {console.log('The POST observable is now completed.'); });
  }
}
