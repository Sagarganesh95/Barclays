import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialogRef } from '@angular/material/dialog';
import "core-js";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4plugins_timeline  from "@amcharts/amcharts4/plugins/timeline"; 
import * as _ from 'lodash';
export interface deviesSelect {
  value: string;
  viewValue: string;
}

export interface DialogData {
  // health: {
  //   labels: string [],
  //   values: number []
  // },
  health: arrayHealth [],
  hours: arrayHealth [],
  minute:  arrayHealth [],
  diff: number,
  subdomain:string,
  roomName: string,
  bleAddress: string,
  floors: string,
  fromDate: Date,
  buildings: string
}

export interface arrayHealth {
  time: Date,
  count: number
}

@Component({
  selector: 'app-adappt-timeline-devices',
  templateUrl: './adappt-timeline-devices.component.html',
  styleUrls: ['./adappt-timeline-devices.component.scss']
})

export class AdapptTimelineDevicesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AdapptTimelineDevicesComponent>, @Inject(MAT_DIALOG_DATA) public data: DialogData, private zone: NgZone) { }
  private chart: am4plugins_timeline.SerpentineChart;
  deviesTypes: deviesSelect [] = [
    {value: 'health', viewValue: 'Health'},
    {value: 'occupancy-min', viewValue: 'OccupancyByMinutes'},
    {value: 'occupancy-hr', viewValue: 'OccupancyByHour'}
  ];
  selected = 'health';
  ngOnInit() { 
    // this.chart.dispose();
    this.getChart(this.data.health);
  }

  selectchange(value) {
    if( value == "health") {
      this.chart.dispose();
      this.getChart(this.data.health)
    } if (value == "occupancy-min") {
      this.chart.dispose();
      this.getChart(this.data.minute)
    } if (value == "occupancy-hr") {
      this.chart.dispose();
      this.getChart(this.data.hours)
    }
  }


  getChart(data) {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdivdevice", am4plugins_timeline.SerpentineChart);
      chart.levelCount = 3;
      chart.data = [];
      chart.data = data;

      chart.dateFormatter.inputDateFormat = "yyyy-MM-ddTHH:mm:ss.SSS";
      chart.dateFormatter.dateFormat = "yyyy-MM-ddTHH:mm:ss.SSS";
      chart.curveContainer.padding(50,20,50,20);
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;

      let marker: any = chart.legend.markers.template.children.getIndex(0);
      marker.cornerRadius(12, 12, 12, 12);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");

      let dateAxis = chart.xAxes.push(new am4charts.DateAxis<any>());
      dateAxis.renderer.grid.template.disabled = true;;
      dateAxis.renderer.line.disabled = true;
      dateAxis.cursorTooltipEnabled = true;
      dateAxis.minZoomCount = 5;

      // dateAxis.renderer.minGridDistance = 70;
      dateAxis.baseInterval = {   
        "timeUnit": "minute",
        "count": 1
      };
      // dateAxis.startLocation = -0.5;
      dateAxis.renderer.line.strokeDasharray = "1,4";
      dateAxis.renderer.line.strokeOpacity = 0.7;
      dateAxis.tooltip.background.fillOpacity = 0.2;
      dateAxis.tooltip.background.cornerRadius = 5;
      dateAxis.tooltip.label.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
      dateAxis.tooltip.label.paddingTop = 7;




      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis<any>());
      valueAxis.tooltip.disabled = true;
      valueAxis.renderer.innerRadius = -50;
      valueAxis.renderer.radius = 50;
      chart.seriesContainer.zIndex = -1;

      let series = chart.series.push(new am4plugins_timeline.CurveStepLineSeries());
      series.fillOpacity = 0.3;
      series.dataFields.dateX = "time";
      series.dataFields.valueY = "count";
      series.tooltipText = "{valueY}";
      series.name = "Device"
      series.fill = am4core.color("#00937c");
      series.strokeWidth = 0.1;
      series.stroke = am4core.color("#ffffff");
      
      series.tooltip.pointerOrientation = "vertical";
      series.tooltip.background.fillOpacity = 0.7;
      series.tooltip.background.cornerRadius = 20;
      series.tooltip.background.strokeOpacity = 0;
      series.tooltip.label.minWidth = 40;
      series.tooltip.label.minHeight = 40;
      series.tooltip.label.textAlign = "middle";
      series.tooltip.label.textValign = "middle";
      let cursor = new am4plugins_timeline.CurveCursor();
      chart.cursor = cursor; 
      cursor.xAxis = dateAxis;
      cursor.yAxis = valueAxis;
      cursor.snapToSeries = series;
      cursor.lineY.disabled = true;
      cursor.lineX.disabled = true;

      chart.scrollbarX = new am4core.Scrollbar();
      chart.scrollbarX.width = am4core.percent(80);
      chart.scrollbarX.align = "center";
      chart.scrollbarX.toBack();


      this.chart = chart;
    })
  }


}
