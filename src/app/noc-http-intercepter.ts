import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NocHttpInterceptorService } from './noc-http-auth-interceptor';


export const NochttpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: NocHttpInterceptorService, multi: true }
];