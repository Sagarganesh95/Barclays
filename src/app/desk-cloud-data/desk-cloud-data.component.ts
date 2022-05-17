import { Component, OnInit, ViewChild, ChangeDetectorRef } from "@angular/core";
import { WorkerService } from "../worker.service";
import * as moment from "moment";
import * as momenttime from "moment-timezone";
// import * as json2csv from "json2csv";
import { Parser } from "json2csv";
import { saveAs } from "file-saver";

// import * as Fs from "fs";

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

import {
  DESKTEMPLATE,
  ChartModule,
  SITESELECT,
  MAILTEMPLATE,
  CUSTOMERDATA
} from "../pcs/pcs-Data";
import { SelectionModel } from "@angular/cdk/collections";
import { ClouddeskService } from "../clouddesk.service";
import { IntervalObservable } from "rxjs/observable/IntervalObservable";
import { NotesComponent } from "../notes/notes.component";
// import { DialogContainerComponent } from "../dialog-container/dialog-container.component";
import { DashboardService } from "../dashboard.service";
import { LoadercomComponent } from "../loadercom/loadercom.component";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { CloudpcsService } from '../cloudpcs.service';
import { AdapptTimelineDevicesComponent } from '../adappt-timeline-devices/adappt-timeline-devices.component';

@Component({
  selector: "app-desk-cloud-data",
  templateUrl: "./desk-cloud-data.component.html",
  styleUrls: ["./desk-cloud-data.component.scss"]
})
export class DeskCloudDataComponent implements OnInit {
  sidenavOpened = true;
  constructor(
    public matDialog: MatDialog,
    public snackBar: MatSnackBar,
    private deskData: ClouddeskService,
    private cdRef: ChangeDetectorRef,
    private sw: WorkerService,
    private dashboard: DashboardService,
    private ngxLoader: NgxUiLoaderService,
    private pcsData: CloudpcsService
  ) {
    this.alive = true; 
    this.sw.checkForUpdates();
  }
  title = "DESK HEALTH ANALYZER";
  selected = {begin:moment().subtract(1, 'day').utc().startOf('day').format() ,end: moment().subtract(1, 'day').utc().endOf('day').format()};
  sitesName: string[] = [];
  filterno: string;
  displayedColumns: string[] = [
    "select",
    "id",
    "customers",
    "buildings",
    "floors",
    "hostName",
    "areaName",
    "bleaddress",
    "startDate",
    "lastresponsetime",
    "noofresponses",
    "noofresponsesTillNow",
    "subject",
    "status",
    "actions"
  ];
  dialogRef;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  dataSource: MatTableDataSource<DESKTEMPLATE>;
  selection = new SelectionModel<DESKTEMPLATE>(true, []);
  selectedValue: string;
  selecttype = "DESK";
  siteSelect: SITESELECT[];
  unhealthyCount = 0;
  count = 0;
  customers: CUSTOMERDATA[];
  das: MAILTEMPLATE[];
  visible: Boolean = false;
  alive: boolean;
  unhealthybuilding: string = "Loading Data...";
  logbuildings: string[];
  masterArray: ChartModule[];
  totalCount: number = 0;
  unhealthyMaster: ChartModule[];
  badgeNo: number = 0;
  getPcsData: any[];
  siteCount?: number;

  ngOnInit() {
    this.ngxLoader.start();
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.filterno = "";
    this.siteSelect = [];
    this.das = [];
    this.customers = [];
    this.getPcsData = [];

    this.logbuildings = [];

    this.dashboard.getDomainList().subscribe(async data => {
      if (data.length > 0) {
        this.sitesName = [...data];
        if (this.sitesName.length == data.length) {
          for (let site of this.sitesName) {
            this.deskData
              .getbuildingsAll(site)
              .subscribe((siteData: SITESELECT) => {
                this.siteSelect.push(siteData);
                if( this.siteSelect.length == this.sitesName.length){
                  this.getDataByDates();
                }
              });
          }
        }
      }
    });

    IntervalObservable.create(10000 * 6 * 15)
      .takeWhile(() => this.alive)
      .subscribe(() => this.promptUser());
    this.getDataByDates();
  }

  ngOnInitDestroy() {
    this.alive = false;
  }

  ngAfterViewInit() {
    this.sort.sortChange.subscribe(() => {
      this.dataSource.sort = this.sort;
    });
  }

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    this.selection.selected === null
      ? (this.badgeNo = 0)
      : (this.badgeNo = this.selection.selected.length);
    numSelected > 0 ? (this.visible = true) : (this.visible = false);
    return numSelected === numRows;
    // this.cdRef.detectChanges();
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
    this.isAllSelected() ? (this.visible = false) : (this.visible = true);
  }

  public promptUser(): any {
    let snackBarRef = this.snackBar.open(
      "A New Data  is available",
      "Refresh",
      {
        horizontalPosition: "left"
      }
    );
    snackBarRef.onAction().subscribe(() => {
      this.getDataByDates();
    });
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
      let newDate = new Date();
      const opts = { fields };
      const parser = new Parser(opts);
      if (this.dataSource.data.length > 0) {
        const csv = parser.parse(this.dataSource.data);
        console.log(csv, "csv");
        const blob = new Blob([csv], { type: "application/csv" });
        console.log("blob", blob);
        saveAs(blob, `"NOC-ADAPPT"- ${newDate.getTime} ${".csv"}`);
      } else {
        console.log("data is 0");
      }
    } catch (err) {
      console.error(err);
    }
  }

  getThresholdData(Tvalue) {
    var da = [];
    if (this.logbuildings.length) {
      this.logbuildings.forEach(element => {
        this.siteSelect.forEach(site => {
          site.buildings.forEach(blg => {
            if (blg.alias == element) {
              this.getPcsData.forEach(pcs => {
                if (pcs.buildings == element) {
                  pcs.id = ++this.count;
                  da.push(pcs);
                }
              });
            }
          });
        });
      });
    } else {
      this.getPcsData.forEach(pcs => {
        pcs.id = ++this.count;
        da.push(pcs);
      });
    }
    da.forEach(ele => {
      let endm = momenttime().tz(ele.blgtimezone);
      let minutes = Math.round(
        moment.duration("" + endm.hour() + ":" + endm.minutes()).asMinutes()
      );
      let calcc = Math.round(minutes / 10);
      if (Tvalue != 0 || Tvalue !== "") {
        if (ele.noofresponses <= Math.round((Tvalue / 100) * (calcc / 2))) {
          ele.status = 0;
        } else {
          ele.status = 1;
        }
      } else {
        if (ele.noofresponses <= (calcc / 2) * (50 / 100)) {
          ele.status = 0;
        } else {
          ele.status = 1;
        }
      }
    });
    da.sort(
      (x, y): any => {
        return x.status - y.status;
      }
    );
    da.forEach(lem => {
      lem.id = ++this.count;
    });
    this.dataSource.data = da;
  }

  getDataByDates() {
    var deskdataArray = [];
    this.unhealthybuilding = " Loading...";
    console.log(this.selected,"selected")
    this.ngxLoader.start();
    this.selectedValue = undefined;
    if (this.selected) {
      var count = 0;
      var count1 = 0;
      this.masterArray = [];
      this.unhealthyMaster = [];
      var unhealthysite = [];
      this.unhealthyCount = 0;
      this.siteCount = 0;
      this.siteSelect.forEach(site => {

        if(site.isDesk == true){
          ++count;
          this.deskData
            .getDatedDeskData(
              this.selected.begin,
              this.selected.end,
              site.name
            )
            .subscribe(async (data: DESKTEMPLATE[]) => {
              ++count1;
              if (data.length > 0) {
                for (let ele of data) {
                  if (ele.noofresponses === 0 && ele.noofresponsesTillNow === 0) {
                    ele.resReview = "outline-bluetooth_disabled";
                  }
                  deskdataArray.push(ele);
                }
                if (deskdataArray.length > 0 && count == count1) {
                  deskdataArray.sort(
                    (x, y): any => {
                      return x.status - y.status;
                    }
                  );
                  this.deskData.getBleLogs().subscribe(async logs => {
                    if (logs.length > 0 && deskdataArray.length > 0) {
                      for await (let log of logs) {
                        for (let pcsSub of deskdataArray) {
                          if (pcsSub.areaName == log.areaName) {
                            pcsSub.subject = log.subject;
                            pcsSub.comments = log.comments;
                          }
                        }
                      }
                    }
                  });
                  this.getPcsData = deskdataArray;
                  for (let f of this.getPcsData) {
                    if (this.masterArray.length == 0) {
                      this.masterArray.push({ name: f.buildings, y: 1 });
                      this.pcsData.changeBuildingName(f.buildings);
                      // ++this.siteCount;
                    } else {
                      var present = 1,
                        index;
                      this.masterArray.forEach(async (a, i) => {
                        if (present == 1) {
                          if (a.name == f.buildings) {
                            present = 2;
                            index = i;
                          }
                        }
                      });
                      if (present == 2) {
                        this.masterArray[index].y += 1;
                      } else {
                        this.masterArray.push({ name: f.buildings, y: 1 });
                      }
                    }
                  }
  
                  for (let f of this.getPcsData) {
                    if (f.status === false) {
                      ++this.unhealthyCount;
                      unhealthysite.push(f.buildings);
                      if (this.unhealthyMaster.length == 0) {
                        this.unhealthyMaster.push({ name: f.buildings, y: 1 });
                      } else {
                        var present = 1,
                          index;
                        this.unhealthyMaster.forEach(async (a, i) => {
                          if (present == 1) {
                            if (a.name == f.buildings) {
                              present = 2;
                              index = i;
                            }
                          }
                        });
                        if (present == 2) {
                          this.unhealthyMaster[index].y += 1;
                        } else {
                          this.unhealthyMaster.push({ name: f.buildings, y: 1 });
                        }
                      }
                    }
                  }
                  this.unhealthybuilding = this.mode(unhealthysite);
                  this.dataSource.data = deskdataArray;
                  this.totalCount = this.dataSource.data.length;
                  this.dataSource.filter = this.filterno.trim().toLowerCase();
                  // this.dialogRef.close();
                  this.ngxLoader.stop();
              }
            };
        });
        }
    })
  }
}

  getselectUpdated(event) {
    var da = [];
    var unhealthysite = [];
    // this.unhealthyCount = 0;
    this.count = 0;
    if (event.length) {
      this.logbuildings = event;
      event.forEach(element => {
        this.getPcsData.forEach(pcs => {
          if (pcs.buildings == element) {
            da.push(pcs);
          }
        });
      });
    } else {
      this.getPcsData.forEach(pcs => {
        da.push(pcs);
        let endm = momenttime().tz(pcs.blgtimezone);
        let minutes = Math.round(
          moment.duration("" + endm.hour() + ":" + endm.minutes()).asMinutes()
        );
        let calcc = Math.round(minutes / 10);
        // this.totalCount = da.length;
        if (pcs.noofresponses < 1) {
          unhealthysite.push(pcs.buildings);
          ++this.unhealthyCount;
        }
        this.unhealthybuilding = this.mode(unhealthysite);
      });
    }

    this.dataSource.data = da;
  }

  mode(array) {
    if (array.length == 0) return null;
    var modeMap = {};
    var maxEl = array[0],
      maxCount = 1;
    for (var i = 0; i < array.length; i++) {
      var el = array[i];
      if (modeMap[el] == null) modeMap[el] = 1;
      else modeMap[el]++;
      if (modeMap[el] > maxCount) {
        maxEl = el;
        maxCount = modeMap[el];
      }
    }
    return maxEl;
  }

  sendMails() {
    this.das = [];
    var count = 0;
    if (this.selection.selected.length > 0){
      this.ngxLoader.start();
      this.selection.selected.forEach(sel => {
        if (sel.subject != undefined || sel.subject != null) {
          this.deskData.getBleLogsForMail(sel.bleaddress).subscribe(logs => {
            ++count;
            logs.forEach(l => {
              this.das.push(l);
            });
            if (this.selection.selected.length == count) {
              this.deskData.sendBlelogsForMail(this.das).subscribe(res => {
                this.selection.clear();
                this.badgeNo = 0;
                this.ngxLoader.stop();
                this.openSnackBar(" Mail Send to -",res.mailId)
              });
            }
          });
        } else {
          this.ngxLoader.stop()
          this.openSnackBar("no Subject", "Dismiss");
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000
    });
  }

  setReportissues(element) {
    this.dialogRef = this.matDialog.open(NotesComponent, {
      width: "500px",
      height: "500px",
      data: element
    });
    this.dialogRef.afterClosed().subscribe(async result => {
      let logRef;
      if (result != undefined) {
        this.ngxLoader.start();
        // logRef = this.matDialog.open(LoadercomComponent, {
        //   width: "250px",
        //   hasBackdrop: true,
        //   disableClose: true
        // });
        if (result.length > 0) {
          for await (let r of result) {
            if (this.getPcsData.length > 0) {
              for (let pcsData of this.getPcsData) {
                if (r.areaName == pcsData.areaName) {
                  pcsData.subject = r.subject;
                }
              }
            }
          }
          this.cdRef.detectChanges();
          this.dataSource.data = this.getPcsData;
          this.ngxLoader.stop();
          logRef.close();

        } else {
          this.ngxLoader.stop();
          logRef.close();
          console.log("no subject updated");
        }
      }
    });
  }

  openDialog(row): void {
    this.ngxLoader.start();
    this.deskData
      .getPlotMins(
        this.selected.begin,
        this.selected.end,
        row.bleId,
        row.customers,
        row.blgtimezone,
        row.blgoffset,
        row.deskName,
        row.bleaddress,
        row.floors,
        row.buildings,
        this.selecttype
      )
      .subscribe((data: Object[]) => {
        this.ngxLoader.stop();
        this.dialogRef = this.matDialog.open(AdapptTimelineDevicesComponent, {
          width: '60%',
          height: '60%',
          data: data,
        })
        this.dialogRef.afterClosed().subscribe();
      });
  }
}
