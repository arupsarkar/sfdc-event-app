import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {map} from 'rxjs/operators';
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

  constructor(private http: HttpClient) { }

  login() {
    console.log('DEBUG: APiService login(): ', 'login() function.');
    const URL = 'oauth2/login';
    const localURL = 'https://sfdc-event-app.herokuapp.com/api/oauth2/login';
    console.log('DEBUG: ApiService login URL : ', `${environment.baseUrl}/${URL}`.toString());
    // return this.http.get(`${environment.baseUrl}/${URL}`)
    return this.http.get(localURL)
      .pipe( map( res => res ));
  }
}
