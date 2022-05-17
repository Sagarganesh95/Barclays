import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../dashboard.service';
import { CloudHostService } from '../cloud-host.service';
import { SITESELECT } from '../pcs/pcs-Data';
import {MatBottomSheet} from '@angular/material/bottom-sheet';
import { CreateUserComponent } from '../create-user/create-user.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';
import { AdapptAuthServiceService } from '../adappt-auth-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-noc-profile-setting',
  templateUrl: './noc-profile-setting.component.html',
  styleUrls: ['./noc-profile-setting.component.scss']
})
export class NocProfileSettingComponent implements OnInit {

  constructor( private userService: DashboardService,private router: Router,
     private auth: AdapptAuthServiceService, private  hostService : CloudHostService, private _bottomSheet: MatBottomSheet, private ngxLoader: NgxUiLoaderService) { }
  otherTheme: string;
  tableFields = [
    {
      displayName: "Serial No.",
      objectName: "id",
      type: "ids"
    },
    {
      displayName: "Full Name",
      objectName: "fullName"
    },
    {
      displayName: "Email Address",
      objectName: "email"
    },
    {
      displayName: "User Name",
      objectName: "username"
    },
    {
      displayName: "Password",
      objectName: "password",
      type: "editPassword"
    },
    {
      displayName: "Last Attempt Time",
      objectName: "LastfailedattemptTime"
    },
    {
      displayName: "Buildings",
      objectName: "Buildings",
      type: "selectBuildings"
    },
    {
      displayName: "isLocked",
      objectName: "isLocked",
      type: "lockType"
    },
    {
      displayName: "isActive",
      objectName: "isActive",
      type: "activeType"
    },
    {
      displayName: "isAdmin",
      objectName: "isAdmin",
      type: "adminType"
    },
    {
      displayName: "Last Login Time",
      objectName: "islastLogin"
    },
    {
      displayName: "Alter Profile",
      objectName: "actions",
      type: "profileChange"
    }
  ];
  tableData = []
  tableFilter = [];
  sitesName: any [];
  siteSelect: SITESELECT [] = [] ;
  ngOnInit() {
    this.ngxLoader.start();
    this.userService.getDomainList().subscribe(async data => {
      if (data.length > 0) {
        this.sitesName = [...data];
          for await (let site of this.sitesName) {
            this.hostService.getbuildingsAllForHost(site).subscribe((siteData: SITESELECT) => {
              this.siteSelect.push(siteData);
              if( this.siteSelect.length == this.sitesName.length){
                    this.getUsers();
              }
            })
          }
      }
    })
  }





  getUsers() {
    this.tableData = [];
    this.userService.getUsers().subscribe( data => {
      this.tableData = [...data]; });
      this.ngxLoader.stop();
  }

  updatedRow($event) {
    if($event.password == this.auth.getToken()){
      this.ngxLoader.start();
        this.getUsers();
    } else {
      this.auth.deleteSession();
      this.router.navigate(['login']);
    }
  }

  filteredData(e) {

  }


  AddUser() {
    let Result = this._bottomSheet.open(CreateUserComponent, {
      hasBackdrop: true,
      backdropClass: "bottom-sheet-class",
      data: { siteSelect:this.siteSelect } 
    });
    // console.log(Result, "Result")
    // if( Result) {
    //   this.getUsers();
    // }
  }

}
