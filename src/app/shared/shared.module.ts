import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdapptToolbarComponent } from "../adappt-toolbar/adappt-toolbar.component";
import { MaterialModule } from "../adappt-material/material.module";
// import { DialogContainerComponent } from "../dialog-container/dialog-container.component";
import { NotesComponent } from "../notes/notes.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AmchartsComponent } from "../amcharts/amcharts.component";
import { PiechartbuildingComponent } from "../piechartbuilding/piechartbuilding.component";
import { PiechartunhealthybuComponent } from "../piechartunhealthybu/piechartunhealthybu.component";
import { LinechartforbuildingComponent } from "../linechartforbuilding/linechartforbuilding.component";
import { AdapptDataTableComponent } from "../adappt-data-table/adappt-data-table.component";
import { ServiceTrackerComponent } from "../service-tracker/service-tracker.component";
import { SharedRoutingModule } from "./shared-routing.module";
import { AmchartSolidGaugeComponent } from "../amchart-solid-gauge/amchart-solid-gauge.component";
import { AmchartMapsComponent } from "../amchart-maps/amchart-maps.component";
import { DevicesOnSitebtmPageComponent } from "../devices-on-sitebtm-page/devices-on-sitebtm-page.component";
import { LoadercomComponent } from "../loadercom/loadercom.component";
import { DevicesTableGenericComponent } from '../devices-table-generic/devices-table-generic.component';
import { FilterDataComponentComponent } from '../filter-data-component/filter-data-component.component';
import { LoginComponent } from '../login/login.component';
import { NochttpInterceptorProviders } from '../noc-http-intercepter';
import { CreateUserComponent } from '../create-user/create-user.component';
import { AdapptTimelineDevicesComponent } from '../adappt-timeline-devices/adappt-timeline-devices.component';
import { NocProfileSettingComponent } from '../noc-profile-setting/noc-profile-setting.component';
import { NoRightClickDirectiveDirective } from '../no-right-click-directive.directive';
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA } from '@angular/compiler/src/core';


@NgModule({
  declarations: [
    AdapptToolbarComponent,
    NotesComponent,
    AmchartsComponent,
    PiechartbuildingComponent,
    PiechartunhealthybuComponent,
    LinechartforbuildingComponent,
    AdapptDataTableComponent,
    ServiceTrackerComponent,
    AmchartSolidGaugeComponent,
    AmchartMapsComponent,
    DevicesOnSitebtmPageComponent,
    LoadercomComponent,
    DevicesTableGenericComponent,
    FilterDataComponentComponent,
    LoginComponent,
    CreateUserComponent,
    AdapptTimelineDevicesComponent,
    NocProfileSettingComponent,
    NoRightClickDirectiveDirective
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    SharedRoutingModule
  ],
  exports: [
    AdapptToolbarComponent,
    NotesComponent,
    AmchartsComponent,
    PiechartbuildingComponent,
    PiechartunhealthybuComponent,
    LinechartforbuildingComponent,
    AdapptDataTableComponent,
    ServiceTrackerComponent,
    AmchartSolidGaugeComponent,
    AmchartMapsComponent,
    DevicesOnSitebtmPageComponent,
    LoadercomComponent,
    DevicesTableGenericComponent,
    FilterDataComponentComponent,
    MaterialModule,
    LoginComponent,
    CreateUserComponent,
    AdapptTimelineDevicesComponent
  ],
  entryComponents: [
    NotesComponent,
    AmchartsComponent,
    DevicesOnSitebtmPageComponent,
    LoadercomComponent,
    AdapptTimelineDevicesComponent,
    CreateUserComponent
  ],
  providers: [ ]
})
export class SharedModule {}
