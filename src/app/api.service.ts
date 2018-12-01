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

  getEvents() {
    const URL = '/getEvents';
    return this.http.get(`${environment.baseUrl}/${URL}`, httpOptions)
      .pipe( map( res => res));
  }
  // login() {
  //   console.log('DEBUG: APiService login(): ', 'login() function.');
  //   const URL = 'oauth2/login';
  //   const localURL = 'https://sfdc-event-app.herokuapp.com/api/oauth2/login';
  //   console.log('DEBUG: ApiService login URL : ', `${environment.baseUrl}/${URL}`.toString());
  //
  //  const sfdc_url = 'https://login.salesforce.com/services/oauth2/authorize?response_type=token&client_id={client_id}&redirect_uri={redirect_uri}';
  //   console.log('DEBUG: login(): url', sfdc_url);
  //   // return this.http.get(`${environment.baseUrl}/${URL}`)
  //   // return this.http.get(localURL, httpOptions)
  //   //   .pipe( map( res => res ));
  // }


  // This method parses the data to JSON
  private parseData(res: Response)  {
    return res.json() || [];
  }
  // Displays the error message
  private handleError(error: Response | any) {
    let errorMessage: string;
    errorMessage = error.message ? error.message : error.toString();
    // In real world application, call to log error to remote server
    // logError(error);
    // This returns another Observable for the observer to subscribe to
    return Observable.throw(errorMessage);
  }
}
