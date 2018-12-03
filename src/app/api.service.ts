import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import {environment} from './environment/environment';
import {MessageService} from './message.service';
import { Event} from './model/Event';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
  }),
  'withCredentials': true
};

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private messageService: MessageService) { }

  getEvents(): Observable<Event[]> {
    const URL = 'getEvents';
    this.messageService.add('ApiService: fetched Platform Events');
    console.log('DEBUG: ApiService: access_token', this.cookieService.get('access_token'));
    console.log('DEBUG: ApiService: instance_url', this.cookieService.get('instance_url'));

    return this.http.get<Event[]> (`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      map( events => events)
    );

    // return this.http.get<Event[]>(`${environment.baseUrl}/${URL}`, httpOptions)
    //   .pipe( map( res => { this.log(JSON.stringify(res)); } ));
  }
  eventsPublish() {
    const URL = 'events/publish';
    console.log('DEBUG: ApiService: Events publish', 'Start');
    console.log('DEBUG: ApiService: Events publish', 'End');


    return this.http.post(`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      tap((res) => { this.log( JSON.stringify(res) ); }),
        catchError( this.handleError<any>(' Error publishing events'))
    );
  }

  // This method parses the data to JSON
  private parseData<T> (res: Response)  {
    return res.json() || [];
  }
  // Displays the error message
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      // TODO: better job of transforming error for user consumption
      this.log(`${operation} failed: ${error.message}`);
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  /** Log a HeroService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ApiService: ${message}`);
  }
}
