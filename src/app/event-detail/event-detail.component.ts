import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event} from '../model/Event';
import { ApiService} from '../api.service';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;
  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private apiService: ApiService
  ) {
    console.log('DEBUG: EventDetailComponent : Constructor()', 'Start');
    console.log('DEBUG: EventDetailComponent : Constructor()', 'End');
  }

  ngOnInit() {
    console.log('DEBUG: EventDetailComponent : OnInit()', 'Start');
    this.getEventMetaData();
    console.log('DEBUG: EventDetailComponent : OnInit()', 'End');
  }

  getEventMetaData(): void {
    console.log('DEBUG: EventDetailComponent : getEventMetaData()', 'Start');
    const api_name = this.route.snapshot.paramMap.get('api_name');
    console.log('DEBUG: EventDetailComponent : getEventMetaData(): api_name - ', api_name);
    this.apiService.getEventDetail(api_name)
      .subscribe(event => this.event = event);
  }
}
