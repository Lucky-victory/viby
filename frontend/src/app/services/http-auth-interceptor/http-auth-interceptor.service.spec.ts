import { TestBed } from '@angular/core/testing';

import { HttpAuthInterceptorService } from './http-auth-interceptor.service';

describe('HttpAuthInterceptorService', () => {
  let service: HttpAuthInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HttpAuthInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
