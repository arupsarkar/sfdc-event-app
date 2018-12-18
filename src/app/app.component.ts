import {Component, OnInit} from '@angular/core';

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

  ngOnInit() {
    this.socketService.initSocket();
    this.initIoConnection();
  }

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`Event Detail Component: ${message}`);
  }
}
