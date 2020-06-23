import { HttpErrorResponse, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { of } from 'rxjs';

@Injectable()
export class AuthInterceptorService implements HttpInterceptor {

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) { }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.user.pipe(
      take(1),
      switchMap(user => {
        if (!user) {
          return this.authService.autoLogin();
        } else {
          return of(user);
        }
      }),
      switchMap(user => {
        const authorization = 'Bearer ' + (user ? user.token : '');
        const modifiedReq = req.clone({
          headers: req.headers.append('ChannelCode', 'WXH5').append('Authorization', authorization)
        });
        return next.handle(modifiedReq).pipe(tap(() => { },
          error => {
            if (error instanceof HttpErrorResponse) {
              if (error.status === 401) {
                console.log('error.status === 401');
                this.router.navigate(['/auth/login'], { queryParams: { from: this.router.url } });
              }
            }
          }));
      })
    );

  }
}
