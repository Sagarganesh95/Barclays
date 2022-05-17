import { Component, OnInit, Input, NgZone, SimpleChanges } from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import am4themes_dataviz from "@amcharts/amcharts4/themes/dataviz";
import { CloudpcsService } from "../cloudpcs.service";
// Themes begin
// am4core.useTheme(am4themes_dataviz);
am4core.useTheme(am4themes_animated);
// am4core.unuseTheme(am4themes_frozen);
am4core.useTheme(am4themes_dark);
// Themes end

// function am4themes_myTheme(target) {
//   if (target instanceof am4core.ColorSet) {
//     target.list = [
//       am4core.color("red")
//     ];
//   }
// }

@Component({
  selector: "app-amchart-solid-gauge",
  templateUrl: "./amchart-solid-gauge.component.html",
  styleUrls: ["./amchart-solid-gauge.component.scss"]
})
export class AmchartSolidGaugeComponent implements OnInit {
  constructor(private zone: NgZone, private pcs: CloudpcsService) {}
  otherTheme: boolean;
  @Input() cards;
  private chart: am4charts.RadarChart;

  ngAfterViewInit() {
    this.zone.runOutsideAngular(() => {
      // Create chart instance
      let chart = am4core.create(this.cards.chartName, am4charts.RadarChart);

      // Add data
      chart.data = this.cards.data1;

      // Make chart not full circle
      chart.startAngle = -90;
      chart.endAngle = 180;
      chart.innerRadius = am4core.percent(50);

      // Set number format
      chart.numberFormatter.numberFormat = "#.#'%'";

      // Create axes
      let categoryAxis = chart.yAxes.push(new am4charts.CategoryAxis() as any);
      categoryAxis.dataFields.category = "name";
      categoryAxis.renderer.grid.template.location = 0;
      categoryAxis.renderer.grid.template.strokeOpacity = 0;
      categoryAxis.renderer.labels.template.horizontalCenter = "right";
      categoryAxis.renderer.labels.template.fontWeight = 400;
      categoryAxis.renderer.labels.template.adapter.add("fill", function(
        fill,
        target
      ) {
        return target.dataItem.index >= 0
          ? chart.colors.getIndex(target.dataItem.index)
          : fill;
      });
      categoryAxis.renderer.minGridDistance = 10;

      let valueAxis = chart.xAxes.push(new am4charts.ValueAxis() as any);
      valueAxis.renderer.grid.template.strokeOpacity = 0;
      valueAxis.min = 0;
      valueAxis.max = 100;
      valueAxis.strictMinMax = true;

      // Create series
      let series1 = chart.series.push(new am4charts.RadarColumnSeries());
      series1.dataFields.valueX = "full";
      series1.dataFields.categoryY = "name";
      series1.clustered = false;
      series1.columns.template.fill = new am4core.InterfaceColorSet().getFor(
        "alternativeBackground"
      );
      series1.columns.template.fillOpacity = 0.08;
      series1.columns.template.strokeWidth = 0;
      series1.columns.template.radarColumn.cornerRadius = 20;

      let series2 = chart.series.push(new am4charts.RadarColumnSeries());
      series2.dataFields.valueX = "value";
      series2.dataFields.categoryY = "name";
      series2.clustered = false;
      series2.columns.template.strokeWidth = 0;
      series2.columns.template.tooltipText = "{name}: [bold]{value}[/]";
      series2.columns.template.radarColumn.cornerRadius = 20;

      series2.columns.template.adapter.add("fill", function(fill, target) {
        return chart.colors.getIndex(target.dataItem.index);
      });

      // Add cursor
      chart.cursor = new am4charts.RadarCursor();
      this.chart = chart;
    });
  }

  ngOnInit() {
    this.pcs.currentMessage.subscribe(message => {
      this.otherTheme = message;
    });
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
