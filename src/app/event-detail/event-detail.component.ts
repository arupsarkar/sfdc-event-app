import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';

import { Event} from '../model/Event';
import { ApiService} from '../api.service';
import { EventFieldSchema} from '../model/event-field-schema';
import { EventSchema } from '../model/event-schema';
import { MessageService} from '../message.service';
import { SocketService} from '../socket.service';
import { EventSocket } from '../shared/event';

export interface Tile {
  color: string;
  cols: number;
  rows: number;
  text: string;
  disable: boolean;
}


@Component({
  selector: 'app-event-detail',
  providers: [Location, {provide: LocationStrategy, useClass: PathLocationStrategy}],
  templateUrl: './event-detail.component.html',
  styleUrls: ['./event-detail.component.css']
})
export class EventDetailComponent implements OnInit {
  @Input() event: Event;
  @Input() eventSchema: EventSchema;
  @Input() eventFieldSchema: EventFieldSchema[];
  message = '';
  ioConnection: any;
  platformEventName: string;

  // Tiles
  backButtonTiles: Tile[] = [
    {text: 'Back', cols: 1, rows: 1, color: '#ECEFF1', disable: false}
  ];
  middleSpaceTiles: Tile[] = [
    {text: '', cols: 2, rows: 1, color: '#ECEFF1', disable: false}
  ];
  saveButtonTiles: Tile[] = [
    {text: 'Save', cols: 1, rows: 1, color: '#ECEFF1', disable: false}
  ];


  constructor(
    private route: ActivatedRoute,
    private location: Location,
    private apiService: ApiService,
    private messageService: MessageService,
    private socketService: SocketService
  ) {
    this.socketService.initSocket();
  }

  ngOnInit() {
    this.getEventMetaData();
    this.initIoConnection();
  }

  private initIoConnection(): void {
    // this.socketService.initSocket();

    this.ioConnection = this.socketService.getEventMessages()
      .subscribe((message: string) => {
        this.log('Message payload : ' + JSON.stringify(message));
      },
        error => {
          this.log('Message payload : ' + JSON.stringify(error));
        }, () => {
          this.log('Event detail IO Connection completed successfully.');
        });


    this.socketService.onEvent(EventSocket.CONNECT)
      .subscribe(() => {
        console.log('connected');
      },
        error => {
          console.log('Event component onEvent Connect error - ' + error);
        }, () => {
          console.log('Event component onEvent Connect complete.');
        });

    this.socketService.onEvent(EventSocket.DISCONNECT)
      .subscribe(() => {
        console.log('disconnected');
      },
        error => {
          console.log('Event component onEvent disconnect error - ' + error);
        }, () => {
          console.log('Event component onEvent disconnect complete.');
        });
  }

  getEventMetaData(): void {
    const fullName = this.route.snapshot.paramMap.get('fullName');
    this.apiService.getEventDetail(fullName)
      .subscribe(eventSchema => {
        this.eventSchema = eventSchema;
        this.eventFieldSchema = this.eventSchema.fields;
        this.platformEventName = eventSchema.label + ' fields.';
      });
  }

  goBack(): void {
    this.location.back();
  }
  save(): void {
    this.apiService.eventsPublish(this.eventSchema).subscribe(
      data => {
          this.message = JSON.stringify(data);
          this.log(`${this.message}`);
          this.middleSpaceTiles[0].text = 'Success';
        },
      error => {
        this.log(`${error}`);
        this.middleSpaceTiles[0].text = 'Error';
      },
      () => {
        this.log('Event publish operation completed successfully.');
        // this.goBack();
      });
  }

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    const d = new Date();
    const datePart = d.toLocaleDateString();
    const timePart = d.toLocaleTimeString();
    const finalDateTime = datePart + ' ' + timePart;
    this.messageService.add(`${finalDateTime} : Event Detail Component: ${message}`);
  }
}
