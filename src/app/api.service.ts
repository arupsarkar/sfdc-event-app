import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import {environment} from './environment/environment';
import {MessageService} from './message.service';
import { Event} from './model/Event';
import { EventSchema } from './model/event-schema';
import {strictEqual} from 'assert';

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

  getEventDetail (fullName: string): Observable<EventSchema> {
    console.log('DEBUG: ApiService : Getting Event Details of ', fullName);
    const URL = 'getEventDetail/' + fullName;
    return this.http.get<EventSchema> (`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      tap( res => {this.log(`fetched event id=${fullName}`);
              this.log(`fetched fields=${JSON.stringify(res)}`);
      }),
      catchError(this.handleError<EventSchema>(`getEventDetail api_name=${fullName}`))
    );
  }
  eventsPublish(eventSchema: EventSchema) {
    const URL = 'events/publish';
    console.log('DEBUG: ApiService: Events publish', 'Start', JSON.stringify(eventSchema));

    return this.http.post(`${environment.baseUrl}/${URL}`, eventSchema, httpOptions).pipe(
      tap((res) => { this.log( JSON.stringify(res) ); }),
        // catchError( this.handleError<any>(' Error publishing events'))
      catchError(this.handleApiError)
    );
  }

  logout(): Observable<any> {
    this.log(`Logout process started`);
    const URL = 'logout';
    return this.http.get<any>(`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      tap( res => {
        this.log(`Logout result: ${JSON.stringify(res)}`);
      }),
      // catchError(this.handleError<any>(`Logout error `))
      catchError(this.handleApiError)
    );
  }

  getConfig(): Observable<any> {
    const URL = 'config';
    return this.http.get<any>(`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      tap( res => {
        this.log(`Config result: ${JSON.stringify(res)}`);
      }),
      catchError(this.handleApiError)
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

  private handleApiError (error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      this.log(`Error : ${JSON.stringify(error.error)}`);
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${JSON.stringify(error.status)}, ` +
        `body was: ${JSON.stringify(error.error)}`);

    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }


  /** Log a EventService message with the MessageService */
  private log(message: string) {
    this.messageService.add(`ApiService: ${message}`);
  }
}
