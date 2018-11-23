import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {LoginOAuth} from './model/LoginOAuth';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type':  'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Authorization, Content-Type, Accept'
  })
};
//  'Authorization': 'my-auth-token'

@Injectable({
  providedIn: 'root'
})
export class EventServiceService {
  constructor(private http: HttpClient) {}
  // login get request
  // login() {
  //   console.log('DEBUG: Event Service - Start 4');
  //   return this.http.get('http://localhost:8000/api/login', httpOptions)
  //     .pipe( map( (response) => response.toString()),
  //       catchError (this.handleError)
  //     );
  // }
  login(): Observable<LoginOAuth[]> {
    // const apiURL = 'http://localhost:3000/api/login';
    const apiURL =  '/oauth2/login';
    return this.http.get<LoginOAuth[]>(apiURL, httpOptions)
      .pipe ( map ( res => res ));
  }

  private handleError (error: Response | any) {
    console.error('ApiService::handleError', error);
    return Observable.throw(error);
  }
}
