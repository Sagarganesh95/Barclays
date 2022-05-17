import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from "@angular/core";
import { NO_ERRORS_SCHEMA } from "@angular/compiler/src/core"
import { CommonModule } from "@angular/common";
import { MaterialModule } from "../adappt-material/material.module";
import { SharedModule } from "../shared/shared.module";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { DeskCloudDataComponent } from "../desk-cloud-data/desk-cloud-data.component";
import { DeskRoutingModule } from "./desk-routing.module";
import { AmchartsComponent } from "../amcharts/amcharts.component";

@NgModule({
  declarations: [DeskCloudDataComponent],
  imports: [
    CommonModule,
    MaterialModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    DeskRoutingModule,
  ]
})
export class DeskModule {}
