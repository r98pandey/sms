import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';

import { AuthenticationService } from '../services/auth.service';
import { AuthfakeauthenticationService } from '../services/authfake.service';
import { environment } from '../../../environments/environment';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(
        private authenticationService: AuthenticationService,
        private authfackservice: AuthfakeauthenticationService
    ) { }

    intercept(
        request: HttpRequest<any>,
        next: HttpHandler
    ): Observable<HttpEvent<any>> {
        if (environment.defaultauth === "firebase") {
          // add authorization header with jwt token if available
          let currentUser = this.authenticationService.currentUser();
          if (currentUser && currentUser.token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${currentUser.token}`,
              },
            });
          }
        } else {
          const token = localStorage.getItem("token");
          if (token) {
            request = request.clone({
              setHeaders: {
                Authorization: `Bearer ${token}`,
                ApiKey: environment["ApiKey"],
              },
            });
          } else {
            request = request.clone({
              setHeaders: {
                ApiKey: environment["ApiKey"]
              }
            })
          }
        }
        return next.handle(request);
    }
}
