import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse
} from '@angular/common/http';

import { Observable } from 'rxjs';
import {tap} from 'rxjs/operators';
import { MessageService } from '../message.service';

/** Pass untouched request through to the next request handler. */
@Injectable()
export class NoopInterceptor implements HttpInterceptor {

  constructor(private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler):
    Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      tap(
        event => {
          // logging http response to browser's console in case of success.
          if (event instanceof HttpResponse) {
            this.messageService.add('Http success response - start');
            this.messageService.add(`${JSON.stringify(event.body)}`);
            this.messageService.add('Http success response - end');
          }
        },
        error => {
          // logging http response to browser's console in case of error.
          if (error instanceof HttpResponse) {
            this.messageService.add('Http error response - start');
            this.messageService.add(`${error.status}`);
            this.messageService.add(`${error.statusText}`);
            this.messageService.add(`${error.type}`);
            this.messageService.add('Http error response - end');
          }
        },
        () => {
          this.messageService.add(`Http response is complete.`);
        }
      )
    );
  }
}

