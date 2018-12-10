import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Event} from '../model/Event';
import { ApiService} from '../api.service';
import { EventFieldSchema} from '../model/event-field-schema';
import { EventSchema } from '../model/event-schema';
import { MessageService} from '../message.service';
import { SocketService} from '../socket.service';
import { EventSocket } from '../shared/event';

@Component({
  selector: 'app-event-detail',
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;
  @Input() eventSchema: EventSchema;
  @Input() eventFieldSchema: EventFieldSchema[];
  message = '';
  ioConnection: any;
  platformEventName : string;

  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private apiService: ApiService,
    private messageService: MessageService,
    private socketService: SocketService
  ) {
    console.log('DEBUG: EventDetailComponent : Constructor()', 'Start');
    console.log('DEBUG: EventDetailComponent : Constructor()', 'End');
  }

  ngOnInit() {
    console.log('DEBUG: EventDetailComponent : OnInit()', 'Start');
    this.socketService.initSocket();
    this.getEventMetaData();
    this.initIoConnection();
    console.log('DEBUG: EventDetailComponent : OnInit()', 'End');
  }

  private initIoConnection(): void {
    this.socketService.initSocket();

    this.ioConnection = this.socketService.getEventMessages()
      .subscribe((message: string) => {
        this.log(JSON.stringify(message));
      });


    this.socketService.onEvent(EventSocket.CONNECT)
      .subscribe(() => {
        console.log('connected');
      });

    this.socketService.onEvent(EventSocket.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      });
  }

  getEventMetaData(): void {
    console.log('DEBUG: EventDetailComponent : getEventMetaData()', 'Start');
    const fullName = this.route.snapshot.paramMap.get('fullName');
    console.log('DEBUG: EventDetailComponent : getEventMetaData(): api_name - ', fullName);
    this.apiService.getEventDetail(fullName)
      .subscribe(eventSchema => {
        this.eventSchema = eventSchema;
        console.log('Fetched event ', JSON.stringify(this.eventSchema));
        console.log('Fetched event fullName : ', this.eventSchema.fullName);
        console.log('Fetched event fields : ', JSON.stringify(this.eventSchema.fields));
        // console.log('Fetched Fields ', JSON.stringify(this.eventSchema[].fields));
        this.eventFieldSchema = this.eventSchema.fields;
        this.platformEventName = eventSchema.label + ' fields.';
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

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Event Detail Component: ${message}`);
  }
}
