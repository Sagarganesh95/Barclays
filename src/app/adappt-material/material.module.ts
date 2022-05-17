import { NgModule } from '@angular/core';
import { AdapptMaterialModule } from './adappt-material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxUiLoaderModule } from  'ngx-ui-loader';
import { CookieService } from 'ngx-cookie-service';
@NgModule({
    imports:[ AdapptMaterialModule, FlexLayoutModule, BrowserAnimationsModule, NgxUiLoaderModule],
    exports:[ AdapptMaterialModule, FlexLayoutModule,BrowserAnimationsModule, NgxUiLoaderModule],
    providers: [ CookieService ]
})
export class MaterialModule {

}