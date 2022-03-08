import { Injectable } from "@angular/core";
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http"
import { catchError, Observable, of } from "rxjs";
import { AuthService } from "./auth.service";
import { Router } from "@angular/router";

@Injectable() 
export class AuthInterceptorService implements HttpInterceptor {
    constructor(private authService: AuthService,private router: Router){}
 
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const modifiedRequest = req.clone({
        headers: req.headers.append('Authorization',`Bearer ${this.authService.token}`)
    })
    console.log(modifiedRequest)
    return next.handle(modifiedRequest).pipe(
        catchError(
          (err, caught) => {
            if (err.status === 401){
              this.handleAuthError();
              return of(err);
            }
            throw err;
          }
        )
      );
    }
    private handleAuthError() {
      // this.authService.token = localStorage.getItem('token');
      // this.router.navigate(['posts'])
      localStorage.removeItem('token');
      localStorage.removeItem('Profile');
      this.router.navigate(['login']);
    };
}
 
 
