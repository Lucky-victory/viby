import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class HttpErrorInterceptorService implements HttpInterceptor {
  constructor() {}
  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse, caught) => {
        let errorMessage = '';
        //if the server returns an array errors
        if (error?.error?.errors) {
          errorMessage = error?.error?.errors
            ?.map((err) => {
              return [`${err?.param}: ${err?.message}`];
            })
            .join('\n\t\n');
        } else if (error?.error?.message) {
          errorMessage = error?.error?.message;
        } else {
          errorMessage = error?.message;
        }
        return throwError(errorMessage);
      })
    );
  }
}
