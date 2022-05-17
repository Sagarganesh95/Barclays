import { Injectable } from '@angular/core';
import { AdapptAuthServiceService } from './adappt-auth-service.service';
import { CanActivate, CanDeactivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AdapptAuthGuardService {

  constructor(private auth: AdapptAuthServiceService, private router: Router) { }
  canActivate(
    next: AdapptAuthGuardService,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean  {
      if( this.auth.isAuthenticated()){
        if( state.url == '/login') {
          this.router.navigate(['/']);
        } else {
          return true
        }
      } else {
          if (state.url !== '/login') {
            this.router.navigate(['login']);
          } else {
            return true
          }  
        }
    }


}
