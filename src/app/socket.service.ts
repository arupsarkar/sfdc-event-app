import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import * as socketIo from 'socket.io-client';

import {MessageService} from './message.service';
import { EventSocket} from './shared/event';

const SERVER_URL = 'https://sfdc-event-app.herokuapp.com';

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  private socket;
  constructor(private messageService: MessageService) { }

  public initSocket(): void {
    this.socket = socketIo(SERVER_URL);
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
