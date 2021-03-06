import { CookieService } from 'ngx-cookie-service';
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import { MessageService } from '../message.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService,
              private messageService: MessageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from the service.
    const access_token = this.cookieService.get('access_token');
    const instance_url = this.cookieService.get('instance_url');
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', access_token + '|' + instance_url)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq).pipe(
      tap(
        event => {
          if ( event instanceof HttpResponse) {
          }
        },
        error => {
          if (error instanceof HttpResponse || error instanceof HttpErrorResponse) {
            this.messageService.add('Error response - Start');
            this.messageService.add(`${error.status}`);
            this.messageService.add(`${error.statusText}`);
            this.messageService.add(`${error.type}`);
            this.messageService.add('Error response - End');
          }
        },
        () => {
        }
      )
    );
  }
}
