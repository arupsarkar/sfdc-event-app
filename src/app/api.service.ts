import { Injectable } from '@angular/core';
import {Observable, of, throwError} from 'rxjs';
import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {catchError, map, retry, tap} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import {environment} from './environment/environment';
import {MessageService} from './message.service';
import { Event} from './model/Event';
import { EventSchema } from './model/event-schema';
import {Contact} from './model/Contact';
import {SearchParams} from './model/Search';

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

  socketServerURL: string;

  constructor(private http: HttpClient,
              private cookieService: CookieService,
              private messageService: MessageService) { }


  getSocketServerURL(): string {
    if (this.socketServerURL.length > 0) {
      return this.socketServerURL;
    }

  }

  searchSOSL(searchParam: SearchParams): Observable<SearchParams> {
    console.log('api.service.ts : ', searchParam);
    const URL = 'searchSOSL';
    this.log(new Date() + ': Search SOSL from salesforce.');
    // @ts-ignore
    return this.http.post(`${environment.baseUrl}/${URL}`, searchParam, httpOptions).pipe(
      tap((res) => { this.log( JSON.stringify(res) ); }),
      catchError(this.handleApiError)
    );
  }

  deleteContact(contact: Contact): Observable<Contact[]> {
    const URL = 'deleteContact';
    this.log(new Date() + ': Deleting contact.');
    // @ts-ignore
    return this.http.post(`${environment.baseUrl}/${URL}`, contact, httpOptions).pipe(
      tap((res) => { this.log( JSON.stringify(res) ); }),
      catchError(this.handleApiError)
    );
  }

  createContact(contact: Contact): Observable<Contact[]> {
    const URL = 'createContact';
    this.log(new Date() + ': Creating contact.');
    // return this.http.post(``, contact, httpOptions).pipe(
    //   tap( (res) => {this.log(JSON.stringify(res)); }), catchError(this.handleApiError)
    // );
    //
    // @ts-ignore
    return this.http.post(`${environment.baseUrl}/${URL}`, contact, httpOptions).pipe(
      tap((res) => { this.log( JSON.stringify(res) ); }),
      catchError(this.handleApiError)
    );
  }

  getContacts(): Observable<Contact[]> {
    const URL = 'getContacts';
    this.log(new Date() + ': Fetching contacts from salesforce.');
    return this.http.get<Contact[]>(`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      map(contacts => contacts)
    );
  }

  getEvents(): Observable<Event[]> {
    const URL = 'getEvents';
    this.log('Fetched Platform Events');
    return this.http.get<Event[]> (`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      map( events => events)
    );
  }

  getEventDetail (fullName: string): Observable<EventSchema> {
    const URL = 'getEventDetail/' + fullName;
    return this.http.get<EventSchema> (`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      tap( res => {
        this.log(`Fetched event - ${fullName}`);
        this.log(`Fetched ${res.fields.length} fields.`);
      }),
      // catchError(this.handleError<EventSchema>(`getEventDetail api_name=${fullName}`))
      catchError(this.handleApiError)
    );
  }
  eventsPublish(eventSchema: EventSchema) {
    const URL = 'events/publish';
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
        this.log(`Logout success : ${JSON.stringify(res)}`);
      },
        error => {
          this.log(`Logout error : ${JSON.stringify(error)}`);
          this.handleApiError(error);
        }),
      // catchError(this.handleError<any>(`Logout error `))
      catchError(this.handleApiError)
    );
  }

  getConfig(): Observable<any> {
    const URL = 'config';
    return this.http.get<any>(`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      retry(3),
      tap( res => {
        this.socketServerURL = res.socket_server_url;
      }),
      catchError(this.handleApiError)
    );
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
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${JSON.stringify(error.status)}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Error : ' + JSON.stringify(error.error)
    );
  }

  /** Log a EventService message with the MessageService */
  private log(message: string) {
    const d = new Date();
    const datePart = d.toLocaleDateString();
    const timePart = d.toLocaleTimeString();
    const finalDateTime = datePart + ' ' + timePart;
    this.messageService.add(`${finalDateTime} : ApiService: ${message}`);
  }
}
