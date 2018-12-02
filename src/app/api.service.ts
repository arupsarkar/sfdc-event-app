import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {catchError, map, tap} from 'rxjs/operators';
import { CookieService } from 'ngx-cookie-service';

import {environment} from './environment/environment';

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

  constructor(private http: HttpClient, private cookieService: CookieService) { }

  getEvents() {
    const URL = 'getEvents';
    console.log('DEBUG: ApiService: access_token', this.cookieService.get('access_token'));
    console.log('DEBUG: ApiService: instance_url', this.cookieService.get('instance_url'));
    return this.http.get(`${environment.baseUrl}/${URL}`, httpOptions)
      .pipe( map( res => res));
  }
  eventsPublish() {
    const URL = 'events/publish';
    console.log('DEBUG: ApiService: Events publish', 'Start');
    console.log('DEBUG: ApiService: Events publish', 'End');

    return this.http.post(`${environment.baseUrl}/${URL}`, httpOptions).pipe(
      tap((data) => console.log(data)), catchError( this.handleError<any>('publish events'))
    );
  }

  // This method parses the data to JSON
  private parseData(res: Response)  {
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
}
