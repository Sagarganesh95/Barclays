import { Component, OnInit, NgZone, Input, Output, EventEmitter } from '@angular/core';
/* Imports */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CloudpcsService } from '../cloudpcs.service';
import { ChartModule } from '../pcs/pcs-Data';
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
am4core.useTheme(am4themes_dark)
// Themes begin
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-piechartunhealthybu',
  templateUrl: './piechartunhealthybu.component.html',
  styleUrls: ['./piechartunhealthybu.component.scss']
})
export class PiechartunhealthybuComponent implements OnInit {

  constructor(private zone: NgZone,private pcsData: CloudpcsService,) { }
  
  @Output() messageEvent = new EventEmitter();
  private chart: am4charts.RadarChart;
  ngOnInit() {
    
      }
  @Input() masterArray : ChartModule[];
  // @Input() selectedBu: any;
  ngAfterViewInit() {
    this.zone.runOutsideAngular( ()=>{
      let chart = am4core.create("chartdiv1", am4charts.PieChart);
      chart.hiddenState.properties.opacity = 0; // this creates initial fade-in
      chart.responsive.enabled = true;
      chart.data = this.masterArray
      // chart.radius = am4core.percent(70);
      // chart.innerRadius = am4core.percent(40);
      chart.radius = am4core.percent(50);
      chart.innerRadius = am4core.percent(30);
      chart.startAngle = 0;
      chart.endAngle = 360;   
      
      let series = chart.series.push(new am4charts.PieSeries());
      series.dataFields.value = "y";
      series.dataFields.category = "name";
      
      series.slices.template.cornerRadius = 10;
      series.slices.template.innerCornerRadius = 7;
      // series.slices.template.draggable = true;
      series.slices.template.inert = true;
      series.slices.template.draggable = false;
      series.alignLabels = true;
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
      series.hiddenState.properties.startAngle = 90;
      series.hiddenState.properties.endAngle = 90;
      
      // chart.legend = new am4charts.Legend();
    })

  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }

}
