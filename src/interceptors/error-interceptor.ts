import {Injectable} from '@angular/core';
import { HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import {Observable, of, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {AuthService, NgAuthService} from '@worldskills/worldskills-angular-lib';
import {ErrorHelper} from '../helpers/error-helper';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

  constructor(private router: Router, private ngAuth: NgAuthService, private auth: AuthService) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // @ts-ignore
    return next.handle(request).pipe(catchError((err: any) => {
      if (err instanceof HttpErrorResponse) {
        // force user to the login page when not logged in or token is expired
        if (request.url.includes('auth/users/loggedIn')) {
          if (ErrorHelper.isNotLoggedIn(err) || ErrorHelper.hasStaleToken(err)) {
            sessionStorage.clear();
            this.ngAuth.login();
            return of(null);
          }
        }

        switch (err.status) {
          case 400:
            // when the logout call fails, clear session then kick to login screen
            if (request.url.match('logout')) {
              sessionStorage.clear();
              localStorage.clear();
              this.ngAuth.login();
              return of(null);
            }
            break;
          case 401:
            if (!request.url.includes('ping')) {
              if (ErrorHelper.isNotLoggedIn(err) || ErrorHelper.hasStaleToken(err)) {
                sessionStorage.clear();
                this.ngAuth.login();
                return of(null);
              } else {
                this.auth.ping().subscribe();
              }
            } else {
              this.ngAuth.login();
            }
            break;
        }
      }

      return throwError(err);
    }));
  }
}
