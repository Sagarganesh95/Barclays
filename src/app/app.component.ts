import { Component, OnInit, SimpleChanges } from "@angular/core";
import { WorkerService } from "./worker.service";
import { Title } from "@angular/platform-browser";
import {
  NavigationCancel,
  Event,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router
} from "@angular/router";

import { CloudpcsService } from "./cloudpcs.service";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"]
})
export class AppComponent {
  title = "Network Operations Center - 1.30.1";
  sidenavOpened = false;
  otherThemes: boolean;

  constructor(
    private sw: WorkerService,
    private _router: Router,
    private pcs: CloudpcsService,
    private titleService: Title,
    private ngxLoader: NgxUiLoaderService
  ) {
    this.sw.checkForUpdates();
    this._router.events.subscribe((event: Event) => {
      this.navigationInterceptor(event);
    });
  }

  ngOnInit() {
    // this.ngxLoader.start();
    // this.pcs.currentMessage.subscribe( data => this.otherThemes = data )
    this.titleService.setTitle("NOC App");
    // this.ngxLoader.stop();
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    this.pcs.currentMessage.subscribe(data => (this.otherThemes = data));
    // console.log(changes);
  }

  private navigationInterceptor(event: Event): void {
    // this._loadingBar.color = "#00937C";
    // this._loadingBar.height = "5px";
    if (event instanceof NavigationStart) {
      // this._loadingBar.start();
      // this.ngxLoader.start();
    }
    if (event instanceof NavigationEnd) {
      // this._loadingBar.complete();
      // this.ngxLoader.start();
    }
    if (event instanceof NavigationCancel) {
      // this._loadingBar.stop();
      // this.ngxLoader.stop();
    }
    if (event instanceof NavigationError) {
      // this.ngxLoader.stop();
    }
  }
}
