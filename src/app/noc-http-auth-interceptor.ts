import { AdapptAuthServiceService } from './adappt-auth-service.service';
import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NocHttpInterceptorService implements HttpInterceptor {

  constructor(private auth: AdapptAuthServiceService) { }
  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.auth.getToken();
    // const user = this.auth.getSession();
    // const Admin = this.auth.getAdminD();
    // const Active = this.auth.getActiveD();
    if (authToken) {
      // const authHeader = JSON.stringify({ authToken: authToken });
      // const authHeader = `NOC-Rule ${authToken}`;
      req = req.clone({ headers: req.headers.set('Authorization', `${authToken}`) });
      // console.log(req)

    }
    return next.handle(req);
  }
}
