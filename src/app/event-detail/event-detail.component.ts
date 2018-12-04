import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event} from '../model/Event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;
  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {
    console.log('DEBUG: EventDetailComponent : Constructor()', 'Start');
    console.log('DEBUG: EventDetailComponent : Constructor()', 'End');
  }

  ngOnInit() {
    console.log('DEBUG: EventDetailComponent : OnInit()', 'Start');
    console.log('DEBUG: EventDetailComponent : OnInit()', 'End');
  }

}
