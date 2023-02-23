import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, switchMap } from "rxjs";
import { AuthService } from "../services/auth.service";

@Injectable()

export class AuthInterceptor implements HttpInterceptor{
    constructor(private authService:AuthService){

    }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        debugger
      return this.authService.getToken().pipe(
        switchMap((token)=>{

            if (!token) {
              return next.handle(req);
            }
        
            const req1 = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${token}`),
            });
        
            return next.handle(req1);
            }
          )
        )
        
    }
    
}