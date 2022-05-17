import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-tracker',
  templateUrl: './service-tracker.component.html',
  styleUrls: ['./service-tracker.component.scss']
})
export class ServiceTrackerComponent implements OnInit {

  constructor() { }
  title = 'NOC Service Tracker';

  sidenavOpened = true;
  tableFilter: [];
  tableData = [
    {
      id: "1",
      date:"10-05-2017",
      issues:"Request",
      planOfAction:"Ble Sensors Change",
      closureDate: [
        {name: 'Lemon'},
        {name: 'Lime'},
        {name: 'Apple'},
      ],
      remarks:"sensors are repaired and replaced",

    }
  ]


  tableFields = [
    {
      displayName: 'Unique Id',
      objectName: 'id'
    },
    {
      displayName: 'Date',
      objectName: 'date'
    },
    {
      displayName: 'Request / Problem',
      objectName: 'issues'
    },
    {
      displayName: 'Plan Of Action',
      objectName: 'planOfAction',
      // type: 'flag'
    },
    {
      displayName: 'Closure Date',
      objectName: 'closureDate',
      type: 'closureDateChips'
    },
    {
      displayName: 'Remarks',
      objectName: 'remarks',
      type: 'TextForm'
    }
  ];
  ngOnInit() {
    console.log(this.tableData)
  }

}
