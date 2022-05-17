import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CloudHostService } from '../cloud-host.service';
import { MatDialog } from '@angular/material/dialog';
import { LoadercomComponent } from '../loadercom/loadercom.component';
import { DashboardService } from '../dashboard.service';
import { PcsclouddataComponent } from '../pcsclouddata/pcsclouddata.component';
import { CloudpcsService } from '../cloudpcs.service';
import { HOSTTEMPLATE } from '../host/hostTemplates';
import { SITESELECT, ChartModule } from '../pcs/pcs-Data';
import { ChangeDetectionStrategy } from '@angular/compiler/src/core';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import * as moment from "moment";
@Component({
  selector: 'app-host-cloud-data',
  templateUrl: './host-cloud-data.component.html',
  styleUrls: ['./host-cloud-data.component.scss']
})
export class HostCloudDataComponent implements OnInit {

  constructor( private hostData: CloudHostService,private cdRef: ChangeDetectorRef,private ngxLoader: NgxUiLoaderService,
     public matDialog: MatDialog, private dashboard: DashboardService, private pcsData: CloudpcsService) { }
  tableData: HOSTTEMPLATE [] = [];
  selected = {begin:moment().subtract(1, 'day').utc().startOf('day').format() ,end: moment().subtract(1, 'day').utc().endOf('day').format()};
  Fields = [
    {
      displayName: "Serial No.",
      objectName: "id",
      type: "ids"
    },
    {
      displayName: "Customers",
      objectName: "sitename",
      
    },
    {
      displayName: "Buildings",
      objectName: "buildingname",
      
    },
    {
      displayName: "Floors",
      objectName: "floorname",
      
    },
    {
      displayName: "Host Names",
      objectName: "hostname",
      
    },
    {
      displayName: "First Response",
      objectName: "firstresponse",
      
    },
    {
      displayName: "Last Response",
      objectName: "lastresponse",
      
    },{
      objectName: "timezone"
    },
    {
      displayName: "Desk-Sensors-Count",
      objectName: "desk",
      type: "desk"
    },
    {
      displayName: "Nova-Sensors-Count",
      objectName: "nova",
      type: "nova"
    },
    {
      displayName: "No. of Responses / Day",
      objectName: "hostlogtodaycount",
      type: "hostLogsToday"
    },
    {
      displayName: `No. of Responses Of ${ moment(this.selected.begin).format('L') } to ${ moment(this.selected.end).format('L') }`,
      objectName: "hostlogtimespecifed",
      type: "hostLogsTimeSpecifed"
    },
    {
      displayName: "Subject",
      objectName: "subject",
      type: "message"
    },
    {
      displayName: "status Info",
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
  tableFilter: [];
  dialogRef;
  tableFieldsName = [];
  // badgeNo = 0;
  filterData;
  unhealthyCount: number = 0;
  totalCount: number = 0;
  unhealthybuilding: string;
  masterArray: ChartModule[];
  unhealthyMaster: ChartModule[];
  checkBox: any [] = [];
  

  filteredArray: HOSTTEMPLATE [];
  tempArray = [];
  // getSelectionData;
  selecttype = "HOST";
  sitesName: string[] = [];
  siteSelect: SITESELECT[] = [];
  ngOnInit() {
    this.ngxLoader.start();
    this.tableFieldsName = this.tableFields.map( field => field.objectName);
    this.unhealthybuilding = "Loading Data...";
    
    this.dashboard.getDomainList().subscribe(async data => {
      if (data.length > 0) {
        this.sitesName = [...data];
        if (this.sitesName.length == data.length) {
          for await (let site of this.sitesName) {
            this.hostData.getbuildingsAllForHost(site).subscribe((siteData: SITESELECT) => {
              this.siteSelect.push(siteData);
              if( this.siteSelect.length == this.sitesName.length){
                console.log("this.siteSelect", this.siteSelect)
                this.getDataByDates(this.selected);
              }
            })
          }
        }
      }
    })
  }

  filteredData($event){
    this.filteredArray = [... $event];
    console.log(this.filteredArray,"filteredArray");
  }

  rowSelect($event) {
    // this.cdRef.detectChanges();
    this.checkBox = $event;
  }

  applyFilter($event) {
    let event = $event;
    this.filterData = event.target.value;
  }

  getDataByDates($event){
    this.ngxLoader.start();
    let dates = $event;
    this.selected = $event;
    this.unhealthyMaster = [];this.masterArray = [];
    let hostdataArray:HOSTTEMPLATE [] = [];this.unhealthyCount = 0;
    this.tableData = [];let pending = 0, counter = 0;this.tableFields = [];
    let unhealthysite = [];
    for( let site of this.siteSelect){
      ++pending;
      this.hostData.getHostData(dates.begin, dates.end, site.name)
        .subscribe(async (data: HOSTTEMPLATE []) => {
          ++counter;
          for( let ele of data){
            hostdataArray.push(ele);
          }
          this.pcsData.getBleLogs().subscribe(async logs => {
            if (logs.length > 0 && hostdataArray.length > 0) {
              for await (let log of logs) {
                for (let pcsSub of hostdataArray) {
                  if (pcsSub.hostname == log.areaName) {
                    pcsSub.subject = log.subject;
                    pcsSub.comments = log.comments;
                  }
                }
              }
            }
          })
          hostdataArray.sort( (x: HOSTTEMPLATE,y: HOSTTEMPLATE): any => {
            return x.hostlogtodaycount - y.hostlogtodaycount
          })
          if( pending == counter){
            this.tableData = [...hostdataArray];
            
            for await (let ele of this.tableData) {
              if (ele.hostlogtodaycount === 0 && ele.hostlogtimespecifed === 0) {
                ele.resReview = "outline-sync_disabled"
              }
              if (ele.hostlogtodaycount == 0) {
                unhealthysite.push(ele.buildingname);
                ++this.unhealthyCount;
              }
  
              if (this.masterArray.length == 0) {
                this.masterArray.push({
                  name: ele.buildingname,
                  y: 1
                })
                this.pcsData.changeBuildingName(ele.buildingname);
              } else {
                var present = 1,
                  index;
                this.masterArray.forEach((a, i) => {
                  if (present == 1) {
                    if (a.name == ele.buildingname) {
                      present = 2
                      index = i
                    }
                  }
                })
                if (present == 2) {
                  this.masterArray[index].y += 1;
                } else {
                  this.masterArray.push({
                    name: ele.buildingname,
                    y: 1
                  })
                }
              }
  
  
              if (ele.status[0].status30m == false) {
                if (this.unhealthyMaster.length == 0) {
                  this.unhealthyMaster.push({
                    name: ele.buildingname,
                    y: 1
                  })
                } else {
                  var present = 1,
                    index;
                  this.unhealthyMaster.forEach((a, i) => {
                    if (present == 1) {
                      if (a.name == ele.buildingname) {
                        present = 2
                        index = i
                      }
                    }
                  })
                  if (present == 2) {
                    this.unhealthyMaster[index].y += 1;
                  } else {
                    this.unhealthyMaster.push({
                      name: ele.buildingname,
                      y: 1
                    })
                  }
                }
              }
              
            }
            // if( unhealthysite.length > 0) {
            //   this.unhealthybuilding = this.mode(unhealthysite);
            // } else {
            //   this.unhealthybuilding = " NO BUILDING UNHEALTHY IN ANY SITE";
            // }
            this.Fields.map( f => {
              if(f.objectName == "hostlogtimespecifed"){
                f.displayName = `No. of Responses Of ${ moment(dates.begin).format('L') } to ${ moment(dates.end).format('L') }`
              }
            })
            this.tableFields = [...this.Fields];
            this.ngxLoader.stop();
            this.tempArray = this.tableData;
            this.totalCount = this.tableData.length;
            this.filteredArray = this.tableData;
            
          }
        });
    }
  }

  mode(array) {
    if (array.length == 0)
      return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null)
        modeMap[el] = 1;
      else
        modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }

  getselectUpdated($event) {
    let event = $event;
    this.ngxLoader.start();
    var da = [];
    // this.unhealthybuilding = "Loading ...";
    var unhealthysite = [];
    
    if (event.length > 0) {
      da = [];unhealthysite = [];
      // this.unhealthyCount = 0;
      event.forEach(element => {
        this.tempArray.forEach(pcs => {
          if (pcs.buildingname == element) {
            da.push(pcs)
            // this.totalCount = da.length;
            // if (pcs.hostlogtodaycount == 0) {
            //   unhealthysite.push(pcs.buildingname);
            //   ++this.unhealthyCount;
            // } 
          }
        });
      });
      // this.dialogRef.close();
      this.ngxLoader.stop();
      this.tableData = [];
      this.cdRef.detectChanges();
      this.tableData = da;
      this.filteredArray = da;
      // if(unhealthysite.length > 0){
      //   this.unhealthybuilding = this.mode(unhealthysite);
      // } else {
      //   this.unhealthybuilding = " NO BUILDING UNHEALTHY IN ANY SITE";
      // }
      
    } else {
      da = [];unhealthysite = [];
      // this.unhealthyCount = 0;
      this.tempArray.forEach(pcs => {
        da.push(pcs)
        // this.totalCount = da.length;
        // if (pcs.hostlogtodaycount == 0) {
        //   unhealthysite.push(pcs.buildingname);
        //   ++this.unhealthyCount;
        // }
      })
      // this.dialogRef.close();
      this.ngxLoader.stop();
      this.tableData = [];
      this.cdRef.detectChanges();
      this.tableData = da;
      // if( unhealthysite.length > 0){
      //   this.unhealthybuilding = this.mode(unhealthysite);
      // }else {
      //     this.unhealthybuilding = " NO BUILDING UNHEALTHY IN ANY SITE";
      //   }
    }
  }


  sendMails() {
    
  }




}
