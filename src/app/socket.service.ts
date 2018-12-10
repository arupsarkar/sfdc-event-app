import { Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { tap, map, catchError } from 'rxjs/operators';
import * as socketIo from 'socket.io-client';

import { Socket} from './shared/interfaces';
import {MessageService} from './message.service';
import { EventSocket} from './shared/event';

const SERVER_URL = 'https://sfdc-event-app.herokuapp.com';

declare var io: {
  connect(url: string): Socket;
};

@Injectable({
  providedIn: 'root'
})
export class SocketService {

  // socket: Socket;
  // observer: Observer<string>;
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
        this.log(`SocketService: getEventMessages = ${data}`);
        observer.next(data);
      });
    });
  }
  // getEventMessages(): Observable<string> {
  //   this.socket = socketIo('https://sfdc-event-app.herokuapp.com');
  //   this.socket.on('data', (res) => {
  //     console.log('---> Socket Service started');
  //     this.observer.next(res.data);
  //     this.log(`Result=${JSON.stringify(res)}`);
  //   });
  //   return this.createObservable();
  // }
  //
  // createObservable(): Observable<string> {
  //   return new Observable<string>(observer => {
  //     this.observer = observer;
  //   });
  // }
  //
  // private handleError(error) {
  //   console.error('server error:', error);
  //   if (error.error instanceof Error) {
  //     const errMessage = error.error.message;
  //     return Observable.create(errMessage);
  //   }
  //   return Observable.create(error || 'Socket.io server error');
  // }

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ApiService: ${message}`);
  }


}
