import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  SimpleChanges
} from "@angular/core";
import * as moment from "moment";
import * as momenttime from "moment-timezone";
var _ = require('lodash');

import {
  MatPaginator} from "@angular/material/paginator";

import {
  MatSort
} from '@angular/material/sort';
import {
  MatTableDataSource
} from '@angular/material/table';
import {
  MatDialog
} from '@angular/material/dialog';
import { 
  MatSnackBar
} from '@angular/material/snack-bar'
import { MatBottomSheet } from "@angular/material/bottom-sheet";
import { DevicesOnSitebtmPageComponent } from "../devices-on-sitebtm-page/devices-on-sitebtm-page.component";
import { ActivatedRoute } from "@angular/router";
import { ClouddeskService } from "../clouddesk.service";
import { DESKTEMPLATE, PCSTEMPLATE, SITESELECT } from "../pcs/pcs-Data";
import { CloudpcsService } from "../cloudpcs.service";
import { DashboardService } from "../dashboard.service";
import { ChangeDetectionStrategy } from "@angular/core";
import { LoadercomComponent } from "../loadercom/loadercom.component";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CloudHostService } from '../cloud-host.service';
import { element } from 'protractor';

export interface LocaData {
  siteName: string;
  salesTypes: string;
  nova: deviceCat;
  desk: deviceCat;
  host: deviceCat;
  daylightOccupancy: deviceCat;
  wlad: deviceCat;
  shippingDate: Date;
  time: Date;
  buildings: any;
}

export interface deviceCat {
  shippment: number;
  installed: number;
  working: number;
}

export interface CardDeviceList {
  name?: string;
  deviceData?: deviceCat;
}
export interface formStructure {
  customer?: string;
  installed: number;
  working: number;
}

@Component({
  selector: "app-site-detail",
  templateUrl: "./site-detail.component.html",
  styleUrls: ["./site-detail.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SiteDetailComponent implements OnInit {
  constructor(
    private bottomSheet: MatBottomSheet,
    private _Activatedroute: ActivatedRoute,
    private dashData: DashboardService,
    private cdRef: ChangeDetectorRef,
    private deskData: ClouddeskService,
    private pcsData: CloudpcsService,
    public dialog: MatDialog,
    private ngxLoader: NgxUiLoaderService,
    private hostData: CloudHostService
  ) {}
  title = "NOC Detail View";
  selected = {begin:moment().subtract(1, 'day').utc().startOf('day').format() ,end: moment().subtract(1, 'day').utc().endOf('day').format()};
  circles = [1, 2, 3, 4, 5];
  tableFilter = [];  tempArray = [];  
  siteSelect: SITESELECT[] = [];
  checkBox: any [] = [];
  filterData;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  // dataSource: MatTableDataSource<DESKTEMPLATE>;
  siteName: string;
  getPcsData: DESKTEMPLATE[];
  filteredArray: DESKTEMPLATE [];
  totalInstalled = 0;
  totalWorking = 0;
  totalShippment = 0;
  Fields = [
    {
      displayName: "Unique Id",
      objectName: "id",
      type: "ids"
    },
    {
      displayName: "Customer",
      objectName: "customers"
    },
    {
      displayName: "Building",
      objectName: "buildings"
    },
    {
      displayName: "Floor",
      objectName: "floors"
    },
    {
      displayName: "Host Name",
      objectName: "hostName"
    },
    {
      displayName: "Desk Name / Room OR Segments Name ",
      objectName: "areaName",
      type: "areaType"
    },
    {
      displayName: "Ble Address",
      objectName: "bleaddress"
    },
    {
      displayName: "Last Response Time",
      objectName: "lastresponsetime",
      type: "responseTime"
    },
    {
      displayName: "No. of Responses / Today",
      objectName: "noofresponses"
      // type: 'flag'
    },
    {
      displayName: `No. of Responses Of ${ moment(this.selected.begin).format('L') } to ${ moment(this.selected.end).format('L') }`,
      objectName: "noofresponsesTillNow"
      // type: 'flag'
    },
    {
      displayName: "Subject",
      objectName: "subject",
      type: "subject"
    },
    {
      displayName: "Status",
      objectName: "status",
      type: "status"
    },
    {
      displayName: "Plot",
      objectName: "actions",
      type: "plot"
    }
  ];
  tableFields = this.Fields;
  tableFieldsName = [];
  tableData = [];
  DeviceList: CardDeviceList[] = [];
  SiteLiveDate: string = " No Data"; 
  SiteOrderDate: string = " No Data";
  loading = true;
  dialogRef;
  otherTheme;

  ngOnInit() {
    this.ngxLoader.start();
    this.tableFieldsName = this.tableFields.map( field => field.objectName);
    this.pcsData.currentMessage.subscribe(message => {
      this.otherTheme = message;
    });
    this._Activatedroute.params.subscribe(params => {
      this.siteName = params["id"];
    });
    this.hostData.getbuildingsAllForHost(this.siteName).subscribe((siteData: SITESELECT) => {
      this.siteSelect.push(siteData);
    })
    this.getLocalSiteConfigSiteWise(this.siteName);
    this.getDataByDates(this.selected);
    this.getHosts(this.siteName);
    this.getLiveData(this.siteName);
  }

  ngOnChanges(changes: SimpleChanges): void {
    //Called before any other lifecycle hook. Use it to inject dependencies, but avoid any serious work here.
    //Add '${implements OnChanges}' to the class.
    // console.log("changes", changes);
  }


  filteredData($event){
    this.filteredArray = [... $event];
    console.log(this.filteredArray,"filteredArray");
  }

  rowSelect($event) {
    // this.cdRef.detectChanges();
    this.checkBox = $event;
    // console.log(this.checkBox)
  }

  applyFilter($event) {
    let event = $event;
    this.filterData = event.target.value;
  }

  getLiveData(siteName) {
    this.pcsData.getLiveData(siteName).subscribe(async data => {
      if (data.length > 0) {
        this.SiteLiveDate = ` ${moment
          .utc(data[0].time)
          .format("DD-MM-YYYY")} - UTC`;
      } else {
        this.SiteLiveDate = " No Data";
      }
    });
  }

  getHosts(siteName) {
    this.dashData
      .getHostCount({
        subdomain: siteName,
        buildingId: "",
        key: false
      })
      .subscribe(async (data: formStructure[]) => {
        if (data.length > 0) {
          for (let locData of data) {
            this.DeviceList.forEach(dev => {
              if (dev.name == "Host") {
                dev.deviceData.installed = locData.installed;
                dev.deviceData.working = locData.working;
              }
            });
          }
        }
      });
  }

  getLocalSiteConfigSiteWise(siteName) {
    this.dashData
      .getLocalSiteConfigSiteWise({ siteName: siteName })
      .subscribe((data: LocaData[]) => {
        if (data.length > 0) {
          let tempLoadData: LocaData = {
            daylightOccupancy:{
              installed: 0,
              working:0,
              shippment:0
            },
            desk:{
              installed: 0,
              working:0,
              shippment:0
            },
            nova:{
              installed: 0,
              working:0,
              shippment:0
            },
            wlad:{
              installed: 0,
              working:0,
              shippment:0
            },
            host:{
              installed: 0,
              working:0,
              shippment:0
            },
            siteName:"",
            time: new Date,
            shippingDate: new Date,
            buildings:"",
            salesTypes:""
          }
          
          for (let locData of data) {
            if (locData.shippingDate) {
              this.SiteOrderDate = ` ${moment
                .utc(data[0].shippingDate)
                .format("DD-MM-YYYY")} - UTC`;
            } else {
              this.SiteOrderDate = " NO Data";
            }
            tempLoadData.daylightOccupancy.installed += locData.daylightOccupancy.installed;
            tempLoadData.daylightOccupancy.shippment += locData.daylightOccupancy.shippment;
            tempLoadData.daylightOccupancy.working += locData.daylightOccupancy.working;
            tempLoadData.desk.shippment += locData.desk.shippment;

            tempLoadData.host.shippment += locData.host.shippment;

            tempLoadData.nova.shippment += locData.nova.shippment;

            tempLoadData.wlad.installed += locData.wlad.installed;
            tempLoadData.wlad.shippment += locData.wlad.shippment;
            tempLoadData.wlad.working += locData.wlad.working;
          }
          // console.log(tempLoadData)
          this.DeviceList.push({
            name: "Daylight Occupancy",
            deviceData: {
              installed: tempLoadData.daylightOccupancy.installed,
              working: tempLoadData.daylightOccupancy.working,
              shippment: tempLoadData.daylightOccupancy.shippment
            }
          });
          this.DeviceList.push({
            name: "Desk",
            deviceData: {
              installed: 0,
              working: 0,
              shippment: tempLoadData.desk.shippment
            }
          });
          this.DeviceList.push({
            name: "Host",
            deviceData: {
              installed: 0,
              working: 0,
              shippment: tempLoadData.host.shippment
            }
          });
          this.DeviceList.push({
            name: "Nova",
            deviceData: {
              installed: 0,
              working: 0,
              shippment: tempLoadData.nova.shippment
            }
          });
          this.DeviceList.push({
            name: "Wlad",
            deviceData: {
              installed: tempLoadData.wlad.installed,
              working: tempLoadData.wlad.working,
              shippment: tempLoadData.wlad.shippment
            }
          });
        } else {
          this.DeviceList.push({
            name: "Daylight Occupancy",
            deviceData: { installed: 0, working: 0, shippment: 0 }
          });
          this.DeviceList.push({
            name: "Desk",
            deviceData: { installed: 0, working: 0, shippment: 0 }
          });
          this.DeviceList.push({
            name: "Host",
            deviceData: { installed: 0, working: 0, shippment: 0 }
          });
          this.DeviceList.push({
            name: "Nova",
            deviceData: { installed: 0, working: 0, shippment: 0 }
          });
          this.DeviceList.push({
            name: "Wlad",
            deviceData: { installed: 0, working: 0, shippment: 0 }
          });
        }
      });
  }

  getDataByDates($selected) {
    let selected = $selected;
    if (selected) {
      this.ngxLoader.start();
      this.tableData = [];
      this.tableFields = [];
      this.deskData
      .getDatedDeskData(selected.begin, selected.end, this.siteName)
        .subscribe(async (desk: DESKTEMPLATE[]) => {
          this.pcsData
            .getDatedPcsData(selected.begin, selected.end, this.siteName)
            .subscribe(async (pcs: PCSTEMPLATE[]) => {
              this.tableData = [];
              var dataArray = [];
              if (pcs.length > 0) {
                let pcsworking = 0;
                for (let ele of pcs) {
                  if (
                    ele.noofresponses === 0 &&
                    ele.noofresponsesTillNow === 0
                  ) {
                    ele.resReview = "outline-error_outline";
                  }
                  // console.log(ele.areaName instanceof Array)
                  if( ele.areaName.length > 1 ){
                    ele.openArea = true;
                    ele.areaName = [`Segments Count is ${ele.areaName.length}`];
                  } else {
                    ele.openArea = false;
                  }

                  if (ele.openArea == true) {
                    ele.areaType = "outline-device_hub";
                  } else {
                    ele.areaType = "outline-camera";
                  }
                  if (ele.status == true) {
                    ++pcsworking;
                  }
                  dataArray.push(ele);
                }
                this.DeviceList.forEach(dev => {
                  if (dev.name == "Nova") {
                    dev.deviceData.installed = pcs.length;
                    dev.deviceData.working = pcsworking;
                  }
                });
              }
              let DeskWorking = 0;
              if (desk.length > 0) {
                for (let ele of desk) {
                  if (
                    ele.noofresponses === 0 &&
                    ele.noofresponsesTillNow === 0
                  ) {
                    ele.resReview = "outline-error_outline";
                  }
                  if (ele.status == true) {
                    DeskWorking++;
                    // console.log(DeskWorking, desk.length)
                  }
                  ele.areaType = "outline-event_seat";
                  dataArray.push(ele);
                }
              }

              if (dataArray.length > 0) {
                for (let lem of dataArray) {
                  // if ( lem.noofresponses < 1 ) {
                  //   lem.status = 0;
                  // } else {
                  //   lem.status = 1;
                  // }
                }
                dataArray.sort(
                  (x, y): any => {
                    return x.status - y.status;
                  }
                );
                this.DeviceList.forEach(dev => {
                  if (dev.name == "Desk") {
                    dev.deviceData.installed = desk.length;
                    dev.deviceData.working = DeskWorking;
                  }
                });
                this.deskData.getBleLogs().subscribe(async logs => {
                  if (logs.length > 0 && dataArray.length > 0) {
                    for await (let log of logs) {
                      for (let pcsSub of dataArray) {
                        if (pcsSub.areaName == log.areaName) {
                          pcsSub.subject = log.subject;
                          pcsSub.comments = log.comments;
                        }
                      }
                    }
                  }
                  this.tableData = [...dataArray];
                  this.Fields.map( f => {
                    if(f.objectName == "noofresponsesTillNow"){
                      f.displayName = `No. of Responses Of ${ moment(selected.begin).format('L') } to ${ moment(selected.end).format('L') }`
                    }
                  })
                  this.tableFields = [...this.Fields];
                  this.tempArray = this.tableData;
                  this.filteredArray = this.tableData;
                  this.loading = false;
                  this.ngxLoader.stop();
                  this.cdRef.detectChanges();
                });
              }
            });
        });
    }
  }

  getselectUpdated($event) {
    let event = $event;
    this.ngxLoader.start();
    let da = [];
    if (event.length > 0) {
      da = [];
      _.forEach(event, element => {
        da =  _.filter(this.tempArray, pcs => {
          return pcs.buildings == element
        })
      })
      this.ngxLoader.stop();
      this.tableData = [];
      this.cdRef.detectChanges();
      this.tableData = da;
      this.filteredArray = da;

      
    } else {
      da = [];
      _.forEach(this.tempArray, pcs => { 
        da.push(pcs)
      })
      this.ngxLoader.stop();
      this.tableData = [];
      this.cdRef.detectChanges();
      this.tableData = da;
    }
  }

  openBottomSheet(): void {
    if (this.siteName) {
      const bottomSheetRef = this.bottomSheet.open(
        DevicesOnSitebtmPageComponent,
        {
          hasBackdrop: true,
          backdropClass: "bottom-sheet-class",
          data: this.siteName
        }
      );
      // console.log(this.bottomSheet)
      bottomSheetRef.afterDismissed().subscribe(result => {
        this.ngxLoader.start();
        // this.ngxLoader.getDefaultConfig()
        // this.dialogRef = this.dialog.open(LoadercomComponent, {
        //   width: "250px",
        //   hasBackdrop: true,
        //   disableClose: true
        // });
        this.DeviceList = [];
        this._Activatedroute.params.subscribe(params => {
          this.siteName = params["id"];
        });
        this.getLocalSiteConfigSiteWise(this.siteName);
        this.getDataByDates(this.selected);
        this.getHosts(this.siteName);
        this.getLiveData(this.siteName);
      });
    }
  }
}
