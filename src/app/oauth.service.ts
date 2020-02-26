import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import {Observable, of} from 'rxjs';
import {SOSLSearchResult} from './model/SOSLSearchResult';
import {catchError, map} from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OauthService {

  constructor(cookieService: CookieService) { }

  GetAccessToken(cookieService: CookieService): void {
    const accessToken = of(cookieService.get('access_token'));
    console.log(new Date(), '');
  }
}
