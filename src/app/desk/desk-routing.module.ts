import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DeskCloudDataComponent } from '../desk-cloud-data/desk-cloud-data.component';
import { AdapptAuthGuardService } from '../adappt-auth-guard.service';


const routes: Routes = [
    { path:'desk-data',canActivate: [AdapptAuthGuardService], component: DeskCloudDataComponent}
];


@NgModule({
    imports:[RouterModule.forChild(routes)],
    exports:[RouterModule]
})

export class DeskRoutingModule {

}