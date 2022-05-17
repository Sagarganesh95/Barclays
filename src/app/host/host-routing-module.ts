import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HostCloudDataComponent } from '../host-cloud-data/host-cloud-data.component';
import { LoginComponent } from '../login/login.component';
import { AdapptAuthGuardService } from '../adappt-auth-guard.service';

// const routes: Routes = [
//     { path: 'host-data', component: HostCloudDataComponent}
// ];

const routes: Routes = [
    {
      path: 'host-data',
      component: HostCloudDataComponent,
      canActivate: [AdapptAuthGuardService]
    },
    { path: 'login', canActivate: [AdapptAuthGuardService], component: LoginComponent}
  ]

@NgModule({
    imports: [ RouterModule.forChild( routes)],
    exports: [ RouterModule]
})

export class HostRoutingModule {

}