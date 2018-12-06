import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event} from '../model/Event';
import { ApiService} from '../api.service';
import { EventFieldSchema} from '../model/event-field-schema';
import { EventSchema } from '../model/event-schema';


@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;
  eventSchema: EventSchema[];
  @Input() eventFieldSchema: EventFieldSchema[];
  message = '';
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
      .subscribe(eventSchema => {
        this.eventSchema = eventSchema;
        console.log('Fetched event ', JSON.stringify(this.eventSchema));
        for ( let i = 0; i <= this.eventSchema.length; i++) {
          console.log('---> fields : ', this.eventSchema[i].fields);
          this.eventFieldSchema = this.eventSchema[i].fields;
        }
        // console.log('Fetched Fields ', JSON.stringify(this.eventSchema[].fields));
        // this.eventFieldSchema = this.eventSchema[0].fields;
      });
  }

  goBack(): void {
    this.location.back();
  }
  save(): void {
    console.log('DEBUG: EventDetailComponent Save() ');
    console.log('---> Updated Event Schema - ', this.eventFieldSchema);
    this.apiService.eventsPublish(this.eventSchema).subscribe(
      data => {
        this.message = JSON.stringify(data); },
      response => {console.log('POST call in error', response); },
      () => {
        console.log('The POST observable is now completed.');
        // this.goBack();
      });
  }

}
