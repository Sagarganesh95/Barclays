import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from './shared/shared.module';
import { MaterialModule } from './adappt-material/material.module';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { PcsModule } from './pcs/pcs.module';
import { CloudpcsService } from './cloudpcs.service';
import { HttpClientModule } from '@angular/common/http';
import { DeskModule } from './desk/desk.module';
import { BrcysSingJapan } from './brcysSingJapan.service';
import { DashboardComponent } from './dashboard/dashboard.component';
import { SiteDetailComponent } from './site-detail/site-detail.component';
import { DashboardService } from './dashboard.service';
import { HostModule } from './host/host.module';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { NochttpInterceptorProviders } from './noc-http-intercepter';
import "core-js";
import { WebSocketService } from './web-socket.service';
// import { NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    SiteDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    PcsModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    HttpClientModule,
    DeskModule,
    HostModule
  ],
  schemas: [],
  providers: [  DashboardService, NochttpInterceptorProviders, WebSocketService ],
  bootstrap: [AppComponent]
})
export class AppModule {}
