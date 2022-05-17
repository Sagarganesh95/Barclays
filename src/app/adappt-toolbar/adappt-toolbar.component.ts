import { Component, OnInit, Input } from '@angular/core';
import { CloudpcsService } from '../cloudpcs.service'
// import { MatBottomSheet, MatBottomSheetRef, MatBottomSheetConfig } from '@angular/material';
import { DevicesOnSitebtmPageComponent } from '../devices-on-sitebtm-page/devices-on-sitebtm-page.component'
import { AdapptAuthGuardService } from '../adappt-auth-guard.service';
import { AdapptAuthServiceService } from '../adappt-auth-service.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adappt-toolbar',
  templateUrl: './adappt-toolbar.component.html',
  styleUrls: ['./adappt-toolbar.component.scss']
})
export class AdapptToolbarComponent implements OnInit {
  @Input() title: String;
  @Input() sidenavOpened: Boolean;
  otherTheme: boolean;
  currentRoute;
  constructor( private route: ActivatedRoute, private pcs: CloudpcsService, public auth: AdapptAuthServiceService, public router: Router) {
    
  }
  
  ngOnInit() {
    // console.log( this.currentRoute, "currentRoute")
    this.otherTheme = false; 
    this.pcs.currentMessage.subscribe(message =>
      {
        // console.log(message)
        this.otherTheme = message
      })
  }



  changeTheme() {
    this.otherTheme = !this.otherTheme;
    this.pcs.changeThemes(this.otherTheme)
  }

  logOut() {
    // this.currentRoute = this.route.snapshot.url;
    // console.log( this.currentRoute, "currentRoute")
    this.auth.deleteSession();
    this.router.navigate(['login']);
  }
  
}
