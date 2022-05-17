import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { CloudpcsService } from '../cloudpcs.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CloudHostService } from '../cloud-host.service';
import { HOSTTEMPLATE } from '../host/hostTemplates';
import * as moment from "moment";
import {
  Parser
} from "json2csv";
import {
  saveAs
} from "file-saver";

@Component({
  selector: 'app-filter-data-component',
  templateUrl: './filter-data-component.component.html',
  styleUrls: ['./filter-data-component.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})


export class FilterDataComponentComponent implements OnInit {

  constructor(private cdRef: ChangeDetectorRef,private hostData: CloudHostService, public snackBar: MatSnackBar, private pcsData: CloudpcsService) { }

  @Input() siteSelect;
  @Input() checkBox: any [];
  // @Input() printDocument;
  @Input() tableData: any [];
  @Output() getDataByDates = new EventEmitter<any>();
  @Output() getselectUpdated = new EventEmitter<any>();
  @Output() applyFilter = new EventEmitter<any>();
  // @Input() sendMails;
  @Input() selected ;
  @Input() tableFieldsName;
  selectedValue: string;
  filterData: string;
  ngOnInit() {
  }

  sendDataByDates() {
    this.getDataByDates.emit(this.selected);
    this.cdRef.detectChanges();
  }

  getselectUpdateds(event) {
    console.log(event,"event")
    this.getselectUpdated.emit(event);
  }

  applyFilterFunction(event) {
    this.applyFilter.emit(event);
  }


  printDocument() {


    try {
      console.log(this.tableFieldsName, "this.tableFieldsName")
      const fields = this.tableFieldsName;

      let newDate = new Date()
      const opts = {
        fields
      };
      const parser = new Parser(opts);
      if (this.tableData.length > 0) {
        const csv = parser.parse(this.tableData);
        const blob = new Blob([csv], {
          type: "application/csv"
        });
        saveAs(blob, `${newDate.getUTCDate()}-NOC-ADAPPT${".csv"}`);
      } else {
        console.log("data is Empty")
        this.openSnackBar("data is Empty", "Dismiss");
      }
    } catch (err) {
      console.error(err);
    }
  }

  sendMails() {
    let das = [];
    var count = 0;
    if (this.checkBox.length > 0)
      this.checkBox.forEach((sel: any) => {
        // console.log(sel)
        if (sel.subject != undefined || sel.subject != null ) {
          this.hostData.getHostComplients(sel.id).subscribe(logs => {
            ++count;
            logs.forEach(l => {
              das.push(l)
            })
            if (this.checkBox.length == count) {
              console.log(das);
              this.pcsData.sendBlelogsForMail(das).subscribe(res => {
                this.openSnackBar(" Mail Send to -",res.mailId)
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
