import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { SiteDetailComponent } from '../site-detail/site-detail.component';
import { ServiceTrackerComponent } from '../service-tracker/service-tracker.component';
import { LoginComponent } from '../login/login.component';
import { AdapptAuthGuardService } from '../adappt-auth-guard.service';
import { CreateUserComponent } from '../create-user/create-user.component';
import { NocProfileSettingComponent } from '../noc-profile-setting/noc-profile-setting.component';

// const routes: Routes = [
//   { path:'login', component: LoginComponent},
//   { path:'dashboard', component: DashboardComponent},
//   { path:'detailView/:id', component: SiteDetailComponent},
//   { path:'serviceTracker', component: ServiceTrackerComponent}
// ];

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    canActivate: [AdapptAuthGuardService],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent }
    ]
  },
  { path: 'detailView/:id',canActivate: [AdapptAuthGuardService], component: SiteDetailComponent },
  { path: 'login', canActivate: [AdapptAuthGuardService], component: LoginComponent},
  { path: 'profileSetting', canActivate: [AdapptAuthGuardService], component: NocProfileSettingComponent}
]

@NgModule({
  imports: [RouterModule.forRoot(routes, { enableTracing: false })],
  exports: [RouterModule]
})

export class SharedRoutingModule {}