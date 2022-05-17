import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { PcsclouddataComponent } from "../pcsclouddata/pcsclouddata.component";
import { MaterialModule } from "../adappt-material/material.module";
import { PcsRoutingModule } from "./pcs-routing.module";
import { SharedModule } from "../shared/shared.module";
// import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { PcsSingJapanComponent } from "../pcs-sing-japan/pcs-sing-japan.component";
// import { ChartsComponent } from "../charts/charts.component";
import { BrcysSingJapan } from "../brcysSingJapan.service";
import { CloudpcsService } from "../cloudpcs.service";
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';

@NgModule({
  declarations: [PcsclouddataComponent, PcsSingJapanComponent],
  imports: [
    CommonModule,
    MaterialModule,
    PcsRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  entryComponents: [],
  providers: [CloudpcsService, BrcysSingJapan]
})
export class PcsModule {}
