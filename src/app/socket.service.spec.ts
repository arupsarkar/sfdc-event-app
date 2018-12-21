import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpHandler} from '@angular/common/http';
import { SocketService } from './socket.service';
import {CommonModule} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import {CookieService} from 'ngx-cookie-service';

describe('SocketService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [CommonModule],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [HttpClient, HttpHandler, CookieService]
  }));

  it('should be created', () => {
    const service: SocketService = TestBed.get(SocketService);
    expect(service).toBeTruthy();
  });
});
