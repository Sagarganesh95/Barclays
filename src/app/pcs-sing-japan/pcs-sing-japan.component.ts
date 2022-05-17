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
import * as moment from 'moment-timezone';
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
import { BrcysSingJapan } from '../brcysSingJapan.service';
import { Parser } from "json2csv";
import { saveAs } from "file-saver";
import { AdapptTimelineDevicesComponent } from '../adappt-timeline-devices/adappt-timeline-devices.component';
declare var require: any



@Component({
  selector: 'app-pcs-sing-japan',
  templateUrl: './pcs-sing-japan.component.html',
  styleUrls: ['./pcs-sing-japan.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PcsSingJapanComponent implements OnInit {
  title = 'PIR HEALTH ANALYZER';
  sidenavOpened = true;
  alive: boolean;
  selected = {begin:new Date() ,end: new Date()};
  filterno: string;selecttype = "pcs";
  sensorType = "PIR";
  alwaysShowCalendars: boolean;
  constructor(public matDialog: MatDialog, public snackBar: MatSnackBar, private pcsData: BrcysSingJapan, private cdRef: ChangeDetectorRef) {
    this.alwaysShowCalendars = true;
    this.alive = true;
  }

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  dataSource: MatTableDataSource < PCSTEMPLATE > ;
  selection = new SelectionModel < PCSTEMPLATE > (true, []);
  siteSelect: SITESELECT[];
  unhealthyCount = 0;
  das: MAILTEMPLATE[];
  unhealthybuilding: string;
  customers: CUSTOMERDATA[];
  selectedValue: string;
  getPcsData: PCSTEMPLATE[];
  totalCount: number = 0;
  sortPcsData: PCSTEMPLATE[];
  logbuildings: string[];
  visible: Boolean = false;
  badgeNo: number = 0;
  sitesName: string[] = ['barclays', 'adobe']
  count = 0
  masterArray: ChartModule[];
  unhealthyMaster: ChartModule[];
  displayedColumns: string[] = [
    'select',
    'id',
    'customers',
    'buildings',
    'floors',
    'RoomName',
    'bleaddress',
    'lastresponsetime',
    'noofresponses',
    'noofresponsesTillNow',
    'subject',
    'status',
    'actions'

  ];

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    this.dataSource.paginator = this.paginator;
    this.filterno = "";
    this.unhealthybuilding = "Loading Data..."
    this.siteSelect = [];
    this.das = [];
    this.customers = [];
    this.getPcsData = [];
    this.logbuildings = [];
    this.sitesName.forEach(async (site) => {
      if(site == 'barclays'){
        this.pcsData.getBuilding(site)
        .subscribe((siteData: SITESELECT) => {
          siteData.buildings.forEach(element => {});
          this.siteSelect.push(siteData)
        })
      }
      
    })

    IntervalObservable.create(10000 * 6 * 15)
      .takeWhile(() => this.alive)
      .subscribe(() => this.promptUser());
    this.getDataByDates(this.selected)
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
        this.getDataByDates(this.getDataByDates(this.selected));
      }
    )
  };


  printDocument() {

    
    try {
      const fields = [
        "customers",
        "buildings",
        "floors",
        "bleaddress",
        "lastresponsetime",
        "noofresponsesTillNow",
        "startDate",
        "lastresponsetime",
        "areaName",
        "subject",
        "comments"
      ];
      let newDate = new Date()
      const opts = { fields };
      const parser = new Parser(opts);
      if(this.dataSource.data.length > 0){
        const csv = parser.parse(this.dataSource.data);
        const blob = new Blob([csv], { type: "application/csv" });
        saveAs(blob,  ` ${newDate}+"NOC-ADAPPT"+${".csv"}`);
      } else {
        console.log("data is 0")
      }
    } catch (err) {
      console.error(err);
    }
  }

  // Date picker code below



  getDataByDates(selected) {
    console.log(selected)
    var pcsdataArray = [];
    this.selectedValue = undefined;
    if (selected) {
      var count = 0;
      var count1 = 0;
      this.unhealthyCount = 0;
      this.sitesName.forEach(site => {
        if(site == 'barclays'){
          ++count;
          this.pcsData.getDatedPcsData(selected.begin, selected.end , site).subscribe((data: PCSTEMPLATE[]) => {
            let date = new Date();
            this.count = 0;
            ++count1;
            data.forEach(ele => {
              pcsdataArray.push(ele)
            })
            if (pcsdataArray.length) {
              let minutes = Math.round(moment.duration('' + date.getHours() + ':' + date.getMinutes()).asMinutes());
              pcsdataArray.forEach(lem => {
                if (minutes / 2 < lem.noofresponses) {
                  lem.status = 1;
  
                } else {
                  lem.status = 0;
                }
              })
              pcsdataArray.sort((x, y): any => {
                return x.status - y.status
              })
              var unhealthysite = [],
                totalpcsCount = [];
              pcsdataArray.forEach(lem => {
                lem.id = ++this.count;
                if (lem.noofresponses == 0) {
                  unhealthysite.push(lem.buildings);
                  ++this.unhealthyCount;
                }
              })
  
              this.unhealthybuilding = this.mode(unhealthysite)
              this.pcsData.getBleLogs().subscribe(logs => {
                if (logs.length > 0 && pcsdataArray.length > 0) {
                  logs.forEach(log => {
                    pcsdataArray.forEach(pcsSub => {
                      if (pcsSub.roomName == log.roomName) {
                        pcsSub.subject = log.subject
                        pcsSub.comments = log.comments
                      }
                    })
                  })
                }
              })
              this.getPcsData = pcsdataArray;
              this.totalCount = this.getPcsData.length;
              this.masterArray = []
              this.getPcsData.forEach(f => {
                if (this.masterArray.length == 0) {
                  this.masterArray.push({
                    name: f.buildings,
                    y: 1
                  })
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
                    this.masterArray[index].y += 1
                  } else {
                    this.masterArray.push({
                      name: f.buildings,
                      y: 1
                    })
                  }
                }
              })
              this.unhealthyMaster = []
              this.getPcsData.forEach(f => {
                if (f.noofresponses == 0) {
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
                      this.unhealthyMaster[index].y += 1
                    } else {
                      this.unhealthyMaster.push({
                        name: f.buildings,
                        y: 1
                      })
                    }
                  }
                }
              })
              console.log(this.masterArray, this.unhealthyMaster)
              this.dataSource.data = pcsdataArray;
              this.dataSource.filter = this.filterno.trim().toLowerCase()
              if (count == count1 && this.unhealthyMaster.length > 0 && this.masterArray.length > 0) {
                
              }
                
            }
          })
        }
        
      })
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


  datepickerChange(selected) {

    this.getDataByDates(selected)
  }

  // Mat Table Code Below

  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;

    this.selection.selected === null ?
      this.badgeNo = 0 :
      this.badgeNo = this.selection.selected.length;
    if (numSelected > 0)
      this.visible = true;
    else
      this.visible = false;
    return numSelected === numRows;
    this.cdRef.detectChanges();
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
    console.log(row)
    this.pcsData.getPlotMins(this.selected.begin, this.selected.end, row.bleId, row.customers, row.blgtimezone, row.blgoffset, row.roomName, row.bleaddress, row.floors, row.buildings).subscribe((data: Object[]) => {
      
      const dialogRef = this.matDialog.open(AdapptTimelineDevicesComponent, {
        width: '60%',
        height: '75%',
        data: data
      })
      dialogRef.afterClosed().subscribe()
    })
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  getselectUpdated(event) {
    var da = [];
    var unhealthysite = [];
    this.unhealthyCount = 0;
    this.count = 0;
    if (event.length) {
      this.logbuildings = event;
      event.forEach(element => {
        this.siteSelect.forEach(site => {
          site.buildings.forEach(blg => {
            if (blg.alias == element) {
              this.getPcsData.forEach(pcs => { 
                if (pcs.buildings == element) {
                  pcs.id = ++this.count;
                  da.push(pcs)
                  this.totalCount = da.length
                  if (pcs.noofresponses == 0) {
                    unhealthysite.push(pcs.buildings);
                    ++this.unhealthyCount;
                  }
                }
              });
              this.unhealthybuilding = this.mode(unhealthysite);
            }
          });
        })
      });





    } else {
      this.getPcsData.forEach(pcs => {
        da.push(pcs)
        this.totalCount = da.length
        if (pcs.noofresponses == 0) {
          unhealthysite.push(pcs.buildings);
          ++this.unhealthyCount;
        }
        this.unhealthybuilding = this.mode(unhealthysite);
      })
    }

    this.dataSource.data = da;
  }

  getThresholdData(Tvalue) {
    let date = new Date();
    let minutes = Math.round(moment.duration('' + date.getHours() + ':' + date.getMinutes()).asMinutes());
    var da = [];
    if (this.logbuildings.length) {
      this.logbuildings.forEach(element => {
        this.siteSelect.forEach(site => {
          site.buildings.forEach(blg => {
            if (blg.alias == element) {
              this.getPcsData.forEach(pcs => {
                if (pcs.buildings == element) {
                  pcs.id = ++this.count;
                  da.push(pcs)
                }
              })
            }
          })
        })
      })
    } else {
      this.getPcsData.forEach(pcs => {
        pcs.id = ++this.count;
        da.push(pcs)
      })
    }
    da.forEach(ele => {
      if (Tvalue != 0 || Tvalue !== "") {
        if (ele.noofresponses <= Math.round((Tvalue / 100) * minutes)) {
          ele.status = 0;

        } else {
          ele.status = 1;
        }
      } else {
        if (ele.noofresponses <= (minutes * (50 / 100))) {
          ele.status = 0
        } else {
          ele.status = 1;
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
    dialogRef.afterClosed().subscribe(result => {
      var da = [];
      if (result != undefined)
        if (result.length > 0) {
          result.forEach((r) => {
            console.log(r)
            if (this.getPcsData.length > 0) {
              this.getPcsData.forEach(pcsData => {
                console.log(r.roomName, pcsData.areaName);
                if (r.roomName == pcsData.areaName) {
                  pcsData.subject = r.subject
                }
                this.dataSource.data = this.getPcsData;
              })
            }

          })
        } else {
          console.log("no subject updated")
        }

    })
  }


  sendMails() {
    console.log(this.selection.selected)
    this.das = []
    var count = 0;
    if (this.selection.selected.length > 0)
      this.selection.selected.forEach(sel => {
        if (sel.subject != undefined || sel.subject != null) {
          this.pcsData.getBleLogsForMail(sel.bleaddress).subscribe(logs => {
            ++count;
            logs.forEach(l => {
              this.das.push(l)
            })
            if (this.selection.selected.length == count) {
              console.log(this.das)
              this.pcsData.sendBlelogsForMail(this.das).subscribe(res => {
                console.log(res)
                this.openSnackBar(res.mailId, "Got Mail")
              })

            }
          })
        } else {
          this.openSnackBar("no Subject", "Dismiss");
        }

      })
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
