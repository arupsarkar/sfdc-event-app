import { TestBed } from '@angular/core/testing';
import {HttpClient, HttpHandler} from '@angular/common/http';

import { ApiService } from './api.service';
import {CommonModule} from '@angular/common';
import {NO_ERRORS_SCHEMA} from '@angular/core';
import { CookieService} from 'ngx-cookie-service';

describe('ApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [],
    imports: [CommonModule],
    schemas: [NO_ERRORS_SCHEMA],
    providers: [HttpClient, HttpHandler, CookieService]
  }));

  it('should be created', () => {
    const service: ApiService = TestBed.get(ApiService);
    expect(service).toBeTruthy();
  });
});
