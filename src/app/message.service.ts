import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];
  messagesSet: string[] = new Set[''];

  add(message: string) {
    this.messagesSet.push(message);
    this.messages = Array.from(new Set(this.messagesSet));
    // this.messages.push(message);
  }

  clear() {
    this.messages = [];
  }
}
