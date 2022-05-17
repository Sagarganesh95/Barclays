import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
am4core.useTheme(am4themes_dark)
import { CloudpcsService } from '../cloudpcs.service';
import { ChartModule } from '../pcs/pcs-Data';
// Themes begin
am4core.useTheme(am4themes_animated);
@Component({
  selector: 'app-piechartbuilding',
  templateUrl: './piechartbuilding.component.html',
  styleUrls: ['./piechartbuilding.component.scss']
})
export class PiechartbuildingComponent implements OnInit {
  

  building: string;
  constructor(private zone: NgZone,private pcsData: CloudpcsService) {
    
   }
  
  private chart: am4charts.PieChart;
  data: ChartModule;
  @Output() messageEvent = new EventEmitter();
  ngOnInit() {
      
      }
  @Input() masterArray : ChartModule[];
  valueData: any;
  ngAfterViewInit() {
    
    this.chart = am4core.create("chartdiv", am4charts.PieChart);
    this.chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
    this.chart.responsive.enabled = true;
    this.chart.data = this.masterArray;
    this.chart.radius = am4core.percent(50);
    this.chart.innerRadius = am4core.percent(30);
    this.chart.startAngle = 0;
    this.chart.endAngle = 360;   
    // this.chart
    

    let series = this.chart.series.push(new am4charts.PieSeries());
    series.dataFields.value = "y";
    series.dataFields.category = "name";
    
    series.slices.template.cornerRadius = 10;
    series.slices.template.innerCornerRadius = 7;
    series.slices.template.draggable = false;
    series.slices.template.inert = true;
    series.alignLabels = true;
    
    series.hiddenState.properties.startAngle = 90;
    series.hiddenState.properties.endAngle = 90;
    // series.slices.template.events.on("over", function(this,event: any){
      
    //   if(event.target.dataItem.dataContext){
    //     event.target.dataItem.slice.clickable = false
    //   } else {
    //     console.log("no click")
    //   }
    // },this)
    series.slices.template.events.on("hit", function(this,event: any){
      
      if(event.target.dataItem.dataContext){
        
        this.pcsData.changeBuildingName(event.target.dataItem.dataContext.name)
        let value = 1;
        this.messageEvent.emit(value);
        var series = event.target.dataItem.component;
        series.slices.each(function(item) {
          if (item.isActive && item != event.target) {
            item.isActive = false;
          }
        })          
      } else {
        console.log("no click")
      }
    },this)
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
