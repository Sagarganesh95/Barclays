import { Component, OnInit, Inject } from "@angular/core";
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import { PCSTEMPLATE } from "../pcs/pcs-Data";
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormGroup,
  FormBuilder
} from "@angular/forms";
import { CloudpcsService } from "../cloudpcs.service";
import * as moment from 'moment-timezone';
import { color } from "@amcharts/amcharts4/core";

@Component({
  selector: "app-notes",
  templateUrl: "./notes.component.html",
  styleUrls: ["./notes.component.scss"]
})
export class NotesComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<NotesComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private fb: FormBuilder,
    private pcs: CloudpcsService
  ) {
    this.createForm();
  }

  notesForm: FormGroup;
  dialogReturn: string[] = [];
  options: string[] = [];
  color = "accent";
  checked: false;
  disabled = true;
  createForm() {
    if (typeof this.data.areaName !== "undefined") {
      this.notesForm = this.fb.group({
        subject: ["", Validators.required],
        comments: ["", Validators.required],
        areaName: [this.data.areaName, Validators.required],
        bleId: this.data.bleId,
        customers: this.data.customers,
        buildings: this.data.buildings,
        floors: this.data.floors,
        bleaddress: this.data.bleaddress,
        lastUpdated: this.data.lastresponsetime,
        noOfResponses: this.data.noofresponses,
        time: new Date(),
        resolved: false,
        resolvedTime: new Date()
      });
    }
  }
  value = "";
  ngOnInit() {
    console.log(this.data);
    this.pcs.getBleSubject().subscribe(logs => {
      if (logs.length > 0) this.options = logs;
    });
    if (typeof this.data.areaName !== "undefined") {
      this.pcs.getBleLogsByRmName(this.data.areaName).subscribe(bleLogsData => {
        console.log(bleLogsData, "bleLogsData");
        if (bleLogsData.length > 0) {
          bleLogsData.forEach(logs => {
            this.notesForm = this.fb.group({
              subject: [logs.subject, Validators.required],
              comments: [logs.comments, Validators.required],
              areaName: [this.data.areaName, Validators.required],
              bleId: this.data.bleId,
              customers: this.data.customers,
              buildings: this.data.buildings,
              floors: this.data.floors,
              bleaddress: this.data.bleaddress,
              lastUpdated: this.data.lastresponsetime,
              noOfResponses: this.data.noofresponses,
              time: new Date(),
              resolved: logs.resolved,
              resolvedTime: logs.resolvedTime
            });
          });
        }
        this.color = "warn";
      });
    }
  }

  saveLogs() {
    console.log(this.notesForm.value);
    this.pcs.sendBleLogs(this.notesForm.value).subscribe(data => {
      this.notesForm.value.subject != undefined ||
      this.notesForm.value.subject != null
        ? this.dialogReturn.push(this.notesForm.value)
        : (this.dialogReturn = []);
    });
  }

  clearLogs() {
    this.createForm();
    this.dialogRef.close();
  }

  resolveLogs() {
    this.notesForm.value.resolved = true;
    this.notesForm.value.resolvedTime = new Date();
    this.pcs.resolveBleLogs(this.notesForm.value).subscribe(data => {
      if (
        this.notesForm.value.subject != undefined ||
        this.notesForm.value.subject != null
      ) {
        this.notesForm.value.subject = "";
        this.dialogReturn.push(this.notesForm.value);
        console.log(this.dialogReturn);
        this.createForm();
      } else {
        this.dialogReturn = [];
        this.createForm();
      }
    });
  }
}
