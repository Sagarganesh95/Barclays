import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HostCloudDataComponent } from '../host-cloud-data/host-cloud-data.component';
import { HostRoutingModule } from './host-routing-module';
import { SharedModule } from '../shared/shared.module';
import { CloudHostService } from '../cloud-host.service';

@NgModule({
  declarations: [HostCloudDataComponent],
  imports: [
    CommonModule,
    HostRoutingModule,
    SharedModule
  ],
  providers: [CloudHostService]
})
export class HostModule { }
