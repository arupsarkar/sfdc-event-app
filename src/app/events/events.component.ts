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
}
