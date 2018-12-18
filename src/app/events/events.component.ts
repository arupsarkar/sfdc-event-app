import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import { ApiService } from '../api.service';
import { Event} from '../model/Event';
import {MessageService} from '../message.service';

@Component({
  selector: 'app-events',
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  platformEventsExist: boolean;
  eventsExistHeader: string;
  message = '';
  events: Event[];
  tileColor: string;
  constructor(private route: ActivatedRoute, private  apiService: ApiService, private messageService: MessageService) {
    this.tileColor = '#455a64';
    this.eventsExistHeader = 'List of platform events.';
  }

  ngOnInit() {
    this.apiService.getEvents().subscribe(
      events => {
        this.events = events;
        this.log(this.events.length + ' events fetched.');
        this.platformEventsExist = events.length > 0;
        if (!this.platformEventsExist) {
          this.eventsExistHeader = 'There are no platform events in this org.';
        }
    }, error => {
        this.log('Events fetched error.' + error);
      }, () => {
        this.log('Events fetched complete.');
      });
  }

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Event Detail Component: ${message}`);
  }
}
