import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {Location, LocationStrategy, PathLocationStrategy} from '@angular/common';
import * as socketIo from 'socket.io-client';

import {MessageService} from './message.service';
import { EventSocket} from './shared/event';
import { ApiService} from './api.service';

const SERVER_URL = 'https://sfdc-event-app.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  constructor(private messageService: MessageService, private apiService: ApiService) { }

  public initSocket(): void {
    // Get the SOCKET_SERVER_URL from settings.
    this.apiService.getConfig().subscribe( params => {
      if (params.socket_server_url !== undefined) {
        console.log('socket_server_url: ', params.socket_server_url);
        this.socket = socketIo(params.socket_server_url);
      }
    });
  }

  public onEvent(eventSocket: EventSocket): Observable<any> {
    return new Observable<Event>(observer => {
      this.socket.on(eventSocket, () => {
        this.log(`SocketService : onEvent=${eventSocket}`);
        observer.next();
      });
    });
  }

  public getEventMessages(): Observable<string> {
    return new Observable<string>(observer => {
      this.socket.on('message', (data: string) => {
        this.log(`SocketService: getEventMessages = ${JSON.stringify(data)}`);
        observer.next(data);
      });
    });
  }
  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ApiService: ${message}`);
  }


}
