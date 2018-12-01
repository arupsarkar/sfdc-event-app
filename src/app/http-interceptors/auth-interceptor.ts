import { CookieService } from 'ngx-cookie-service';
import {HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private cookieService: CookieService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    // Get the auth token from the service.
    const access_token = this.cookieService.get('access_token');
    const instance_url = this.cookieService.get('instance_url');
    console.log('DEBUG: ApiService: access_token', access_token);
    console.log('DEBUG: ApiService: instance_url', instance_url);
    // Clone the request and replace the original headers with
    // cloned headers, updated with the authorization.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', access_token + '|' + instance_url)
    });

    // send cloned request with header to the next handler.
    return next.handle(authReq);
  }
}
