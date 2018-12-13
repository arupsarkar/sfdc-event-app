import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class MessageService {
  messages: string[] = [];

  add(message: string) {
    this.messages.push(message);
    // Removing duplicates from the array
    this.messages = this.messages.filter((el, i, a) => i === a.indexOf(el));
  }

  clear() {
    this.messages = [];
  }
}
