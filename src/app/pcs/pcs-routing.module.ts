import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PcsclouddataComponent } from '../pcsclouddata/pcsclouddata.component';
import { PcsSingJapanComponent } from '../pcs-sing-japan/pcs-sing-japan.component';
import { AdapptAuthGuardService } from '../adappt-auth-guard.service';

const routes: Routes = [
    { path:'pcs-data',canActivate: [AdapptAuthGuardService], component: PcsclouddataComponent},
    { path:'sing-japan-pcs-data',canActivate: [AdapptAuthGuardService], component: PcsSingJapanComponent}
];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class PcsRoutingModule {

}