import {Component, OnInit} from '@angular/core';
import {Observable, of, throwError} from 'rxjs';

import { SocketService} from './socket.service';
import { EventSocket } from './shared/event';
import { MessageService} from './message.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  ioConnection: any;

  constructor(private socketService: SocketService, private messageService: MessageService) {
    this.socketService.initSocket();
  }
  private initIoConnection(): void {
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

  ngOnInit() {
    const source = Observable.create(0, 1).delay(3000);
    const subscription = source.subscribe(
      function(data) {
        console.log(data);
      }, function (error) {
        console.log(error);
      }, function () {
        this.initIoConnection();
        console.log('Complete');
      }
    );

  }

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Event Detail Component: ${message}`);
  }
}
