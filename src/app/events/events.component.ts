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
  tileColor: string;
  constructor(private route: ActivatedRoute, private  apiService: ApiService) {
    this.tileColor = '#455a64';
  }

  ngOnInit() {
    this.apiService.getEvents().subscribe( events => this.events = events );
  }
}
