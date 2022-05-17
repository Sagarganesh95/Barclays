import { Component, OnInit, Input, NgZone } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4maps from "@amcharts/amcharts4/maps";
import am4geodata_continentsHigh from "@amcharts/amcharts4-geodata/continentsHigh";
import am4themes_material from "@amcharts/amcharts4/themes/material";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
/* Chart code */
// Themes begin
// am4core.useTheme(am4themes_material);
am4core.useTheme(am4themes_animated);

@Component({
  selector: 'app-amchart-maps',
  templateUrl: './amchart-maps.component.html',
  styleUrls: ['./amchart-maps.component.scss']
})
export class AmchartMapsComponent implements OnInit {

  constructor(private zone: NgZone) { }
  private chart: am4maps.MapChart;
  @Input() mapData;
  ngOnInit() {
} 
ngAfterViewInit(): void {
  // console.log(this.mapData, "mapData");
  this.zone.runOutsideAngular( () => {
    let targetSVG = "M9,0C4.029,0,0,4.029,0,9s4.029,9,9,9s9-4.029,9-9S13.971,0,9,0z M9,15.93 c-3.83,0-6.93-3.1-6.93-6.93S5.17,2.07,9,2.07s6.93,3.1,6.93,6.93S12.83,15.93,9,15.93 M12.5,9c0,1.933-1.567,3.5-3.5,3.5S5.5,10.933,5.5,9S7.067,5.5,9,5.5 S12.5,7.067,12.5,9z";
  
    // Create map instance
    let chart = am4core.create("mapdiv1", am4maps.MapChart);
    chart.seriesContainer.draggable = false;
    chart.seriesContainer.resizable = false;
    // Set map definition
    chart.geodata = am4geodata_continentsHigh;
    
    // Set projection
    chart.projection = new am4maps.projections.Miller();
    
    // Create map polygon series
    let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
    
    // Exclude Antartica
    polygonSeries.exclude =  ["antarctica"];
    
    // Make map load polygon (like country names) data from GeoJSON
    polygonSeries.useGeodata = true;
    
    // Configure series
    let polygonTemplate = polygonSeries.mapPolygons.template;
    polygonTemplate.strokeOpacity = 0.5;
    polygonTemplate.nonScalingStroke = true;
    
    // create capital markers
    let imageSeries = chart.series.push(new am4maps.MapImageSeries());
    
    // define template
    let imageSeriesTemplate = imageSeries.mapImages.template;
    let circle = imageSeriesTemplate.createChild(am4core.Sprite);
    circle.scale = 0.4;
    circle.fill = new am4core.InterfaceColorSet().getFor("alternativeBackground");
    circle.path = targetSVG;
    // what about scale...
    
    // set propertyfields
    imageSeriesTemplate.propertyFields.latitude = "latitude";
    imageSeriesTemplate.propertyFields.longitude = "longitude";
    
    imageSeriesTemplate.horizontalCenter = "middle";
    imageSeriesTemplate.verticalCenter = "middle";
    imageSeriesTemplate.align = "center";
    imageSeriesTemplate.valign = "middle";
    imageSeriesTemplate.width = 8;
    imageSeriesTemplate.height = 8;
    imageSeriesTemplate.nonScaling = true;
    imageSeriesTemplate.tooltipText = "{name}";
    imageSeriesTemplate.fill = am4core.color("#000");
    imageSeriesTemplate.background.fillOpacity = 0;
    imageSeriesTemplate.background.fill = am4core.color("#ffffff");
    imageSeriesTemplate.setStateOnChildren = true;
    imageSeriesTemplate.states.create("hover");
    if( this.mapData.length > 0) {
      imageSeries.data = this.mapData;
    } else {
      console.log("not add")
    }
    this.chart = chart;
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  })
}

ngOnDestroy() {
  this.zone.runOutsideAngular(() => {
    if (this.chart) {
      // this.chart.
      this.chart.dispose();
    }
  });
}
  

}
