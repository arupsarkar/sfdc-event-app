import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, retry, tap} from 'rxjs/operators';
import {Tweet} from './model/Tweet';
import {Contact} from './model/Contact';
import {environment} from './environment/environment';
import {MessageService} from './message.service';

export interface TwitterResponse {
  data: any;
  resp: any;
}

@Injectable({
  providedIn: 'root'
})
export class TwitterService {

  constructor(private http: HttpClient,
              private messageService: MessageService) { }

  getTwitterUserDetails(): Observable<TwitterResponse> {
    const URL = 'getTwitterUserDetails';
    this.log(new Date() + ': Fetching user details from twitter.');
    return this.http.get<TwitterResponse>(`${environment.baseUrl}/${URL}`).pipe(
      map(tweets => tweets)
    );
  }


  private log(message: string) {
    const d = new Date();
    const datePart = d.toLocaleDateString();
    const timePart = d.toLocaleTimeString();
    const finalDateTime = datePart + ' ' + timePart;
    this.messageService.add(`${finalDateTime} : ApiService: ${message}`);
  }
}
