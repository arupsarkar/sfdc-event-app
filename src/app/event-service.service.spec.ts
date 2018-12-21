import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpHandler} from '@angular/common/http';
import { EventServiceService } from './event-service.service';
import {CommonModule} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

describe('EventServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [CommonModule],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [HttpClient, HttpHandler, CookieService]
  }));

  it('should be created', () => {
    const service: EventServiceService = TestBed.get(EventServiceService);
    expect(service).toBeTruthy();
  });
});
