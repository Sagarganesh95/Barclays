import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
  ChangeDetectorRef
} from '@angular/core';
import {
  SelectionModel
} from '@angular/cdk/collections';
import * as moment from 'moment';
import * as momenttime from 'moment-timezone';
import {
  MatSnackBar
} from '@angular/material/snack-bar';
import {
  IntervalObservable
} from "rxjs/observable/IntervalObservable";
import 'rxjs/add/operator/takeWhile';
import * as _ from 'lodash';


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
  CloudpcsService
} from '../cloudpcs.service';
import {
  PCSTEMPLATE,
  SITESELECT,
  MAILTEMPLATE,
  CUSTOMERDATA,
  ChartModule
} from '../pcs/pcs-Data';
import {
  NotesComponent
} from '../notes/notes.component';
import {
  WorkerService
} from '../worker.service';
import {
  DashboardService
} from '../dashboard.service';
import {
  LoadercomComponent
} from '../loadercom/loadercom.component';
// import { async } from 'q';
// declare var require: any
import {
  Parser
} from "json2csv";
import {
  saveAs
} from "file-saver";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdapptTimelineDevicesComponent } from '../adappt-timeline-devices/adappt-timeline-devices.component';
@Component({
  selector: 'app-pcsclouddata',
  templateUrl: './pcsclouddata.component.html',
  styleUrls: ['./pcsclouddata.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PcsclouddataComponent implements OnInit {
  title = 'NOVA HEALTH ANALYZER';
  sidenavOpened = true;
  alive: boolean;
  otherTheme: boolean;
  constructor(public matDialog: MatDialog, public snackBar: MatSnackBar, private pcsData: CloudpcsService,private ngxLoader: NgxUiLoaderService,
    private cdRef: ChangeDetectorRef, private sw: WorkerService, private dashboard: DashboardService) {
    this.sw.checkForUpdates();
    this.alive = true;
  }
  selected = {begin:moment().subtract(1, 'day').utc().startOf('day').format() ,end: moment().subtract(1, 'day').utc().endOf('day').format()};
  filterno: string;
  selecttype = "NOVA";
  @ViewChild(MatPaginator, { 
    static: false
  }) paginator: MatPaginator;
  @ViewChild(MatSort, {
    static: false
  }) sort: MatSort;
  dataSource: MatTableDataSource < PCSTEMPLATE > ;
  selection = new SelectionModel < PCSTEMPLATE > (true, []);
  siteSelect: SITESELECT[];
  unhealthyCount = 0;
  totalCount: number = 0;
  das: MAILTEMPLATE[];
  unhealthybuilding: string;
  customers: CUSTOMERDATA[];
  selectedValue: string;
  getPcsData: any[];
  sortPcsData: PCSTEMPLATE[];
  logbuildings: string[];
  visible: Boolean = false;
  badgeNo: number = 0;
  sitesName: string[] = [];
  count = 0;
  siteCount: number = 0;
  dialogRef;
  masterArray: ChartModule[];
  disabledinput = false;
  unhealthyMaster: ChartModule[];
  displayedColumns : string [] = [
    'select',
    'id',
    'customers',
    'buildings',
    'floors',
    'hostName',
    'RoomName',
    'bleaddress',
    'startDate',
    'lastresponsetime',
    'noofresponses',
    'noofresponsesTillNow',
    'subject',
    'status',
    'actions'
  ];
  ngOnInit() {
    this.pcsData.currentMessage.subscribe(message => {
      // console.log(message, "pcsmessage");
      this.otherTheme = message
    })
    this.ngxLoader.start();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.filterno = "";
    this.unhealthybuilding = "Loading Data...";
    this.siteSelect = [];
    this.das = [];
    this.customers = [];
    this.getPcsData = [];
    this.logbuildings = [];


    this.dashboard.getDomainList().subscribe(async data => {
      if (data.length > 0) {
        this.sitesName = [...data];
        if (this.sitesName.length == data.length) {
          for await (let site of this.sitesName) {
            this.pcsData.getBuilding(site).subscribe((siteData: SITESELECT) => {
              this.siteSelect.push(siteData);
              if( this.siteSelect.length == this.sitesName.length){
                this.getDataByDates();
              }
            })
          }
          
        }
      }
    })
    IntervalObservable.create(10000 * 6 * 15)
      .takeWhile(() => this.alive)
      .subscribe(() => this.promptUser());
  }

  ngOnInitDestroy() {
    this.alive = false
  }


  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.dataSource.sort = this.sort;
    })
  }

  public promptUser(): any {
    let snackBarRef = this.snackBar.open(
      'A New Data  is available',
      'Refresh', {
        horizontalPosition: 'left'
      }
    );
    snackBarRef.onAction().subscribe(
      () => {
        this.getDataByDates();
      }
    )
  };




  // Date picker code below



  
  async getDataByDates() {
    this.selectedValue = undefined;
    if (this.selected) {
      let pcsdataArray = [];
      var count = 0;
      var count1 = 0;
      this.masterArray = [];
      this.unhealthyMaster = [];
      var unhealthysite = [];
      // this.displayedColumns = [];
      this.unhealthyCount = 0;
      let counter = 0;
      for (let site of this.siteSelect) {
        if( site.isRoom == true || site.isSegment == true){
          ++count;
          this.pcsData.getDatedPcsData(this.selected.begin, this.selected.end, site.name).subscribe(async (data: PCSTEMPLATE[]) => {
            ++count1; 
            
            for await (let ele of data) {
              if (ele.noofresponses === 0 && ele.noofresponsesTillNow === 0) {
                ele.resReview = "outline-bluetooth_disabled"
              }
              pcsdataArray.push(ele);
            }
            console.log(pcsdataArray.length, count, count1);
            if ((pcsdataArray.length > 0) && count == count1) {
              pcsdataArray.sort((x, y): any => {
                return x.status - y.status
              })
  
              for (let lem of pcsdataArray) {
  
                lem.id = ++counter;
                if (lem.status == false) {
                  unhealthysite.push(lem.buildings);
                  ++this.unhealthyCount;
                }

                if( lem.areaName.length > 1 ){
                  lem.openArea = true;
                  lem.areaName = [`Segments Count is -  ${lem.areaName.length}`];
                } else {
                  lem.openArea = false;
                }
              }
              this.unhealthybuilding = this.mode(unhealthysite);
              this.pcsData.getBleLogs().subscribe(async logs => {
                if (logs.length > 0 && pcsdataArray.length > 0) {
                  for await (let log of logs) {
                    for (let pcsSub of pcsdataArray) {
                      if (pcsSub.areaName == log.areaName) {
                        pcsSub.subject = log.subject
                        pcsSub.comments = log.comments
                      }
                    }
                  }
                } 
                this.getPcsData = pcsdataArray;
                for (let f of this.getPcsData) {
  
                  if (this.masterArray.length == 0) {
                    this.masterArray.push({
                      name: f.buildings,
                      y: 1
                    })
                    this.pcsData.changeBuildingName(f.buildings);
                  } else {
                    var present = 1,
                      index;
                    this.masterArray.forEach((a, i) => {
                      if (present == 1) {
                        if (a.name == f.buildings) {
                          present = 2
                          index = i
                        }
                      }
                    })
                    if (present == 2) {
                      this.masterArray[index].y += 1;
                    } else {
                      // ++this.siteCount;
                      this.masterArray.push({
                        name: f.buildings,
                        y: 1
                      })
                    }
                  }
                }
  
                for (let f of this.getPcsData) {
                  if (f.status == false) {
                    if (this.unhealthyMaster.length == 0) {
                      this.unhealthyMaster.push({
                        name: f.buildings,
                        y: 1
                      })
                    } else {
                      var present = 1,
                        index;
                      this.unhealthyMaster.forEach((a, i) => {
                        if (present == 1) {
                          if (a.name == f.buildings) {
                            present = 2
                            index = i
                          }
                        }
                      })
                      if (present == 2) {
                        this.unhealthyMaster[index].y += 1;
                      } else {
                        this.unhealthyMaster.push({
                          name: f.buildings,
                          y: 1
                        })
                      }
                    }
                  }
                }
                this.dataSource.data = pcsdataArray;
                this.totalCount = this.dataSource.data.length;
                this.dataSource.filter = this.filterno.trim().toLowerCase()
                // this.dialogRef.close();
                this.ngxLoader.stop();
              });
            }
          })
        }
      }
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

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    // console.log(this.selection,"this.selection")
    this.selection.selected === null ?
      this.badgeNo = 0 :
      this.badgeNo = this.selection.selected.length;


    if (numSelected > 0)
      this.visible = true;
    else
      this.visible = false;
    // this.cdRef.detectChanges();
    return numSelected === numRows;
  }

  printDocument() {


    try {
      const fields = [
        "customers",
        "buildings",
        "floors",
        "bleaddress",
        "lastresponsetime",
        "noofresponses",
        "noofresponsesTillNow",
        "startDate",
        "lastresponsetime",
        "areaName",
        "subject",
        "comments"
      ];
      let newDate = new Date()
      const opts = {
        fields
      };
      const parser = new Parser(opts);
      if (this.dataSource.data.length > 0) {
        const csv = parser.parse(this.dataSource.data);
        const blob = new Blob([csv], {
          type: "application/csv"
        });
        saveAs(blob, ` ${newDate}+"NOC-ADAPPT"+${".csv"}`);
      } else {
        console.log("data is 0")
      }
    } catch (err) {
      console.error(err);
    }
  }

  

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.selection.clear() :
      this.dataSource.data.forEach(row => this.selection.select(row));
    this.isAllSelected() ?
      this.visible = false :
      this.visible = true

  }

  // Mat Dialog Code Below


  openDialog(row): void {

    this.ngxLoader.start();
    this.pcsData.getPlotMins(this.selected.begin, this.selected.end, row.bleId, row.customers, row.blgtimezone, row.blgoffset, row.roomName, row.bleaddress, row.floors, row.buildings, this.selecttype).subscribe((data: Object[]) => {
      
      this.ngxLoader.stop();
      this.dialogRef = this.matDialog.open(AdapptTimelineDevicesComponent, {
        width: '60%',
        height: '60%',
        data: data,
      })
      this.dialogRef.afterClosed().subscribe()
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getselectUpdated(event) {
    var da = [];
    if (event.length) {
      this.logbuildings = event;
      event.forEach(element => {
        this.getPcsData.forEach(pcs => {
          if (pcs.buildings == element) {
            da.push(pcs)
          }
        })



        // this.siteSelect.forEach(site => {
        //   site.buildings.forEach(blg => {
        //     if (blg.alias == element) {
        //       this.getPcsData.forEach(pcs => {
        //         if (pcs.buildings == element) {
        //           da.push(pcs)
        //         }
        //       });
        //     }
        //   });
        // })
      });
    } else {
      da = [...this.getPcsData];
    }
    this.dataSource.data = da;
  }

  getThresholdData(Tvalue) {

    var da = [];
    // if (this.logbuildings.length) {
    //   this.logbuildings.forEach(element => {
    //     this.getPcsData.forEach(pcs => {
    //       if( pcs.buildings ==  element) {
    //         da.push(pcs);
    //       }
    //     })
    //   })
    // } else {
    //   this.getPcsData.forEach(pcs => {
    //     pcs.id = ++this.count;
    //     da.push(pcs)
    //   })
    // }
    da.forEach(ele => {
      let endm = momenttime().tz(ele.blgtimezone);
      let minutes = Math.round(moment.duration('' + endm.hour() + ':' + endm.minutes()).asMinutes());
      if (Tvalue != 0 || Tvalue !== "") {
        if (ele.noofresponses <= Math.round((Tvalue / 100) * minutes)) {
          ele.status = 1;

        } else {
          ele.status = 0;
        }
      } else {
        if (ele.noofresponses <= (minutes * (50 / 100))) {
          ele.status = 1
        } else {
          ele.status = 0;
        }
      }

    })
    da.sort((x, y): any => {
      return x.status - y.status
    })
    da.forEach(lem => {
      lem.id = ++this.count;
    })
    this.dataSource.data = da;
  }


  setReportissues(element) {
    const dialogRef = this.matDialog.open(NotesComponent, {
      width: '500px',
      height: '500px',
      data: element
    })
    dialogRef.afterClosed().subscribe(async (result) => {
      let logRef;
      if (result != undefined) {
        logRef = this.matDialog.open(LoadercomComponent, {
          width: '250px',
          hasBackdrop: true,
          disableClose: true
        });
        if (result.length > 0) {
          for await (let r of result) {
            if (this.getPcsData.length > 0) {
              for (let pcsData of this.getPcsData) {
                if (r.areaName == pcsData.areaName) {
                  pcsData.subject = r.subject
                }
              }
            }
          }
          this.cdRef.detectChanges();
          this.dataSource.data = this.getPcsData;
          logRef.close();
        } else {
          logRef.close();
          console.log("no subject updated")
        }
      }

    })
  }


  sendMails() {
    console.log(this.selection.selected)
    this.das = [];
    var count = 0;
    if (this.selection.selected.length > 0){
      this.ngxLoader.start();
      this.selection.selected.forEach(sel => {
        if (sel.subject != undefined || sel.subject != null) {
          this.pcsData.getBleLogsForMail(sel.bleaddress).subscribe(logs => {
            ++count;
            logs.forEach(l => {
              this.das.push(l)
            })
            if (this.selection.selected.length == count) {
              console.log(this.das);
              this.pcsData.sendBlelogsForMail(this.das).subscribe(res => {
                this.selection.clear();
                this.badgeNo = 0;this.ngxLoader.stop();
                this.openSnackBar(" Mail Send to -",res.mailId)
              })
            }
          })
        } else {
          this.ngxLoader.stop();
          this.openSnackBar("no Subject", "Dismiss");
        }
      });
      
    }
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
