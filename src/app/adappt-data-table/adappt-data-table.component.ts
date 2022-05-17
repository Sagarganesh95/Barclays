import {
  Component,
  OnInit,
  Input,
  ViewChild,
  SimpleChanges,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  EventEmitter,
  Output
} from "@angular/core";

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
  MatChipInputEvent
} from '@angular/material/chips'
import { SelectionModel } from "@angular/cdk/collections";
import { COMMA, ENTER } from "@angular/cdk/keycodes";

// import * as moment from "moment";
import * as moment from 'moment-timezone';
import { ClouddeskService } from "../clouddesk.service";
// import { DialogContainerComponent } from "../dialog-container/dialog-container.component";
import { NotesComponent } from "../notes/notes.component";
import { LoadercomComponent } from "../loadercom/loadercom.component";
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AdapptTimelineDevicesComponent } from '../adappt-timeline-devices/adappt-timeline-devices.component';

@Component({
  selector: "app-adappt-data-table",
  templateUrl: "./adappt-data-table.component.html",
  styleUrls: ["./adappt-data-table.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AdapptDataTableComponent implements OnInit {
  constructor(
    private cdRef: ChangeDetectorRef,
    public matDialog: MatDialog,
    private deskData: ClouddeskService,
    private ngxLoader: NgxUiLoaderService
  ) {}
  dataSource: MatTableDataSource<Object>;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  // selected = { begin: new Date(), end: new Date() };
  selectable = true;
  removable = false;
  addOnBlur = true;
  getPcsData: any[];
  // fruits: Fruit[] = [];
  selecttype = "desk";

  @Input() tableFields = [];
  @Input() selected;
  @Input() tableData;
  @Input() tableFilter;
  @Output() rowSelect =  new EventEmitter<any>();
  @Output() filteredData = new EventEmitter<any>();
  dialogRef;
  displayedColumns: string[] = [];
  selection = new SelectionModel<Object>(true, []);
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  index = 0;
  ngOnInit() {
    this.displayedColumns.push('select');
    const fields = this.tableFields.map(field => field.objectName);
    this.displayedColumns = this.displayedColumns.concat(fields);
    // this.displayedColumns.push('controls');
    // if(this.tableData.length > 0){}
    this.dataSource = new MatTableDataSource(this.tableData);
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
    this.cdRef.detectChanges();
    // this.fruits = this.tableData.closureDate;
    // console.log(this.fruits)
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.tableFilter && this.dataSource) {
      this.dataSource.filter = this.tableFilter.trim().toLowerCase();
      if (this.dataSource.paginator) {
        this.dataSource.paginator.firstPage();
        this.dataSource = new MatTableDataSource(this.tableData);
        this.cdRef.detectChanges();
      }
    }
    // console.log(changes.tableData)
    // if (changes.tableData.previousValue !== changes.tableData.currentValue) {
    //   // console.log(changes.tableData, "change");
    // }
  }
  isAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  openDialog(row): void {
    this.ngxLoader.start();
    console.log(this.selected,"this.selected")
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
        // this.dialogRef.close();
        this.dialogRef = this.matDialog.open(AdapptTimelineDevicesComponent, {
          width: "70%",
          height: "85%",
          data: data
        });
        this.ngxLoader.stop()
      });
  }

  isString(val) {
    return typeof val === "object";
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    if(this.isAllSelected()){
      this.selection.clear();
      this.rowSelect.emit([]);
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
      this.rowSelect.emit(this.selection.selected);
    }

    console.log(this.rowSelect,"rowSelect")
}

  add(event: MatChipInputEvent): void {
    const input = event.input;
    const value = event.value;
  }

  setReportissues(element) {
    const dialogRef = this.matDialog.open(NotesComponent, {
      width: "500px",
      height: "500px",
      data: element
    });
    let loadCom;
    dialogRef.afterClosed().subscribe(result => {
      this.ngxLoader.start()
      if (result != undefined)
        if (result.length > 0) {
          result.forEach(r => {
            console.log(r, this.tableData);
            if (this.tableData.length > 0) {
              this.tableData.forEach(pcsData => {
                if (r.areaName === pcsData.areaName) {
                  pcsData.subject = r.subject;
                }
                this.dataSource.data = this.tableData;
                this.ngxLoader.stop()
              });
            }
          });
        } else {
          this.ngxLoader.stop()
          console.log("no subject updated");
        }
    });
  }
}
