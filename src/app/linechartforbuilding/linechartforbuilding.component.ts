import {
  Component,
  NgZone,
  OnInit,
  Input,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  SimpleChanges,
  Output,
  EventEmitter
} from "@angular/core";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { CloudpcsService } from "../cloudpcs.service";
import am4themes_dark from "@amcharts/amcharts4/themes/dark";
import am4themes_frozen from "@amcharts/amcharts4/themes/frozen";
import { BrcysSingJapan } from "../brcysSingJapan.service";
import { DashboardService } from "../dashboard.service";
import { CloudHostService } from '../cloud-host.service';
import { async } from 'rxjs/internal/scheduler/async';
// am4core.useTheme(am4themes_dark);

function am4themes_myTheme(target) {
  if (target instanceof am4core.InterfaceColorSet) {
    target.setFor("secondaryButton", am4core.color("#6DC0D5"));
    target.setFor(
      "secondaryButtonHover",
      am4core.color("#6DC0D5").lighten(-0.2)
    );
    target.setFor(
      "secondaryButtonDown",
      am4core.color("#6DC0D5").lighten(-0.2)
    );
    target.setFor(
      "secondaryButtonActive",
      am4core.color("#6DC0D5").lighten(-0.2)
    );
    target.setFor("secondaryButtonText", am4core.color("#FFFFFF"));
    target.setFor("secondaryButtonStroke", am4core.color("#467B88"));
  }
}

am4core.useTheme(am4themes_animated);
// am4core.unuseTheme(am4themes_dark);
am4core.useTheme(am4themes_dark);
// am4core.unuseAllThemes();

@Component({
  selector: "app-linechartforbuilding",
  templateUrl: "./linechartforbuilding.component.html",
  styleUrls: ["./linechartforbuilding.component.scss"],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LinechartforbuildingComponent implements OnInit {
  private chart: am4charts.XYChart;
  constructor(
    private zone: NgZone, 
    private pcsData: CloudpcsService,
    private brSingData: BrcysSingJapan,
    private cdRef: ChangeDetectorRef,
    private dashboard: DashboardService,
    private hostData: CloudHostService
  ) {}

  @Input() selected: string;
  @Input() selecttype: any;
  @Input() sensorType: any;
  @Input() favoriteType: string;
  @Input() selectedDate:any;
  @Output() trendDate = new EventEmitter <any>();
  ngOnInit() {
}


ngOnChanges(changes: SimpleChanges): void {

  this.loadTrendData();
}

  loadTrendData() {
    this.dashboard.getDomainList().subscribe(async data => {
      if (data.length > 0) {
        this.sitesName = [...data];
        if (this.sitesName.length == data.length) {
          this.chartData = [];
          let buildingName = "";
          if (this.selecttype == "NOVA") {
            this.pcsData.msgBuilding.subscribe(building => {
              this.loading = true;
              this.cdRef.detectChanges();
              this.sitesName.forEach(site => {
                this.pcsData.getBuilding(site).subscribe( async (buildings) => {
                  for (const bu of buildings.buildings) { 
                    if (bu.alias == building) {
                      if( this.favoriteType == "LastWeek") {
                        await this.pcsData.getDateForSensors(site).subscribe( (data: any)=> {
                          this.trendDate.emit({ begin: data.startDate, end: data.endDate});
                        })
                      }
                      await this.pcsData
                        .getBuildingCount(
                          site,
                          bu.alias,
                          bu.timezone,
                          bu.timezoneOffset,
                          this.selecttype,
                          this.favoriteType,
                          this.selectedDate
                        )
                        .subscribe(d => {
                          this.loading = false;
                          this.cdRef.detectChanges();
                          this.loadChart(d);
                        });
                    }
                  }
                });
              });
            });
          } 
          if (this.selecttype == "DESK") {
            this.pcsData.msgBuilding.subscribe(building => {
              this.loading = true;
              this.cdRef.detectChanges();
              this.sitesName.forEach(site => {
                this.pcsData.getbuildingsAll(site).subscribe(async (buildings) => {
                  for (const bu of buildings.buildings) { 
                    if (bu.alias == building) {
                      if( this.favoriteType == "LastWeek") {
                        await this.pcsData.getDateForSensors(site).subscribe( (data: any)=> {
                          this.trendDate.emit({ begin: data.startDate, end: data.endDate});
                        })
                      }
                      await this.pcsData
                        .getBuildingCount(
                          site,
                          bu.alias,
                          bu.timezone,
                          bu.timezoneOffset,
                          this.selecttype,
                          this.favoriteType,
                          this.selectedDate
                        )
                        .subscribe(d => {
                          this.loading = false;
                          this.cdRef.detectChanges();
                          this.loadChart(d);
                        });
                    }
                  }
                });
              });
            });
          }

          if (this.selecttype == "PIR") {
            this.brSingData.msgBuilding.subscribe(building => {
              this.loading = true;
              this.cdRef.detectChanges();
              buildingName = building;
              this.sitesName.forEach(site => {
                this.brSingData.getBuilding(site).subscribe(async (buildings)  => {
                  for (const bu of buildings.buildings) { 
                    if (bu.alias == buildingName) {
                      if( this.favoriteType == "LastWeek") {
                        await this.pcsData.getDateForSensors(site).subscribe( (data: any)=> {
                          this.trendDate.emit({ begin: data.startDate, end: data.endDate});
                        })
                      }
                      await this.pcsData
                        .getBuildingCount(
                          site,
                          bu.alias,
                          bu.timezone,
                          bu.timezoneOffset,
                          "NOVA",
                          this.favoriteType,
                          this.selectedDate
                        )
                        .subscribe(d => {
                          this.loading = false;
                          this.cdRef.detectChanges();
                          this.loadChart(d);
                        });
                    }
                  }
                });
              });
            });
          }

          if (this.selecttype == "HOST") {
            this.pcsData.msgBuilding.subscribe(building => {
              this.loading = true;
              this.cdRef.detectChanges();
              this.sitesName.forEach(site => {
                this.pcsData.getbuildingsAll(site).subscribe( async (buildings) => {
                  for (const bu of buildings.buildings) {
                    if (bu.alias == building) {
                      if( this.favoriteType == "LastWeek") {
                        await this.hostData.getDateForHost(site).subscribe( (data: any)=> {
                          this.trendDate.emit({ begin: data.startDate, end: data.endDate});
                        })
                      }
                      await this.hostData
                        .getHostUnhelathyTrend(
                          site,
                          bu.alias,
                          bu.timezone,
                          bu.timezoneOffset,
                          this.selecttype,
                          this.favoriteType,
                          this.selectedDate
                        )
                        .subscribe(d => {
                          this.loading = false;
                          this.cdRef.detectChanges();
                          this.loadChart(d);
                        });
                    }
                  }

                  // buildings.buildings.forEach(bu => {
                    
                  // })
                })
              })
            })
        }
      }
    }
  })
  }


  loading = true;
  sitesName: string[] = [];
  chartData: string[];
  mode = "indeterminate";
  ngAfterViewInit() {}

  loadChart(d: any) {
    this.zone.runOutsideAngular(() => {
      let chart = am4core.create("chartdiv2", am4charts.XYChart);
      chart.dateFormatter.inputDateFormat = "DD.MM.YYYY";
      chart.data = d;
      chart.legend = new am4charts.Legend();
      chart.legend.useDefaultMarker = true;
      let marker: any = chart.legend.markers.template.children.getIndex(0);
      marker.cornerRadius(12, 12, 12, 12);
      marker.strokeWidth = 2;
      marker.strokeOpacity = 1;
      marker.stroke = am4core.color("#ccc");
      // Create axes
      let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
      let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

      // Create series
      let workSeries = chart.series.push(new am4charts.LineSeries());
      workSeries.dataFields.valueY = "working";
      workSeries.dataFields.dateX = "day";
      workSeries.name = "Working";
      workSeries.tooltipText = "{working}";
      workSeries.strokeWidth = 2;
      workSeries.stroke = am4core.color("#00937c");
      workSeries.minBulletDistance = 15;
      workSeries.fill = am4core.color("#00937c");

      // Drop-shaped tooltips
      workSeries.tooltip.background.cornerRadius = 20;
      workSeries.tooltip.background.strokeOpacity = 0;
      workSeries.tooltip.pointerOrientation = "vertical";
      workSeries.tooltip.label.minWidth = 40;
      workSeries.tooltip.label.minHeight = 40;
      workSeries.tooltip.label.textAlign = "middle";
      workSeries.tooltip.label.textValign = "middle";

      let nOworkSeries = chart.series.push(new am4charts.LineSeries());
      nOworkSeries.dataFields.valueY = "notworking";
      nOworkSeries.dataFields.dateX = "day";
      nOworkSeries.tooltipText = "{notworking}";
      nOworkSeries.name = "Not Working";
      nOworkSeries.strokeWidth = 2;
      nOworkSeries.stroke = am4core.color("#FF0000");
      nOworkSeries.minBulletDistance = 15;
      nOworkSeries.fill = am4core.color("#FF0000");
      // Drop-shaped tooltips
      nOworkSeries.tooltip.background.cornerRadius = 20;
      nOworkSeries.tooltip.background.strokeOpacity = 0;
      nOworkSeries.tooltip.pointerOrientation = "vertical";
      nOworkSeries.tooltip.label.minWidth = 40;
      nOworkSeries.tooltip.label.minHeight = 40;
      nOworkSeries.tooltip.label.textAlign = "middle";
      nOworkSeries.tooltip.label.textValign = "middle";

      let totalSeries = chart.series.push(new am4charts.LineSeries());
      totalSeries.dataFields.valueY = "total";
      totalSeries.dataFields.dateX = "day";
      totalSeries.tooltipText = "{total}";
      totalSeries.name = "Total";
      totalSeries.strokeWidth = 2;
      totalSeries.stroke = am4core.color("#6771dc");
      totalSeries.minBulletDistance = 15;
      totalSeries.fill = am4core.color("#6771dc");
      // Drop-shaped tooltips
      totalSeries.tooltip.background.cornerRadius = 20;
      totalSeries.tooltip.background.strokeOpacity = 0;
      totalSeries.tooltip.pointerOrientation = "vertical";
      totalSeries.tooltip.label.minWidth = 40;
      totalSeries.tooltip.label.minHeight = 40;
      totalSeries.tooltip.label.textAlign = "middle";
      totalSeries.tooltip.label.textValign = "middle";

      // Make bullets grow on hover
      let bullet = workSeries.bullets.push(new am4charts.CircleBullet());
      bullet.circle.strokeWidth = 2;
      bullet.circle.radius = 4;
      bullet.circle.fill = am4core.color("#00937c");

      let bullethover = bullet.states.create("hover");
      bullethover.properties.scale = 1.3;

      // Make a panning cursor
      chart.cursor = new am4charts.XYCursor();
      // chart.cursor.behavior = "panXY";
      chart.cursor.xAxis = dateAxis;
      chart.cursor.snapToSeries = workSeries;
      chart.cursor.snapToSeries = nOworkSeries;
      chart.cursor.snapToSeries = totalSeries;

      // Create vertical scrollbar and place it before the value axis
      chart.scrollbarY = new am4core.Scrollbar();
      chart.scrollbarY.parent = chart.leftAxesContainer;
      chart.scrollbarY.toBack();

      // Create a horizontal scrollbar with previe and place it underneath the date axis
      // let scrollbarX = new am4charts.XYChartScrollbar();
      // scrollbarX.series.push(workSeries);
      // scrollbarX.series.push(nOworkSeries);
      // scrollbarX.series.push(totalSeries);
      // // scrollbarX.
      // scrollbarX.background.fill = am4core.color("#424242");
      // scrollbarX.endGrip.background.fill = am4core.color("#424242");
      // scrollbarX.endGrip.background.states.getKey(
      //   "hover"
      // ).properties.fill = am4core.color("#424242");
      // scrollbarX.endGrip.background.states.getKey(
      //   "down"
      // ).properties.fill = am4core.color("#424242");
      // scrollbarX.startGrip.background.fill = am4core.color("#424242");
      // scrollbarX.startGrip.background.states.getKey(
      //   "hover"
      // ).properties.fill = am4core.color("#424242");
      // scrollbarX.startGrip.background.states.getKey(
      //   "down"
      // ).properties.fill = am4core.color("#424242");
      // scrollbarX.thumb.background.fill = am4core.color("#424242");
      // scrollbarX.thumb.background.states.getKey(
      //   "hover"
      // ).properties.fill = am4core.color("#424242");
      // scrollbarX.thumb.background.states.getKey(
      //   "down"
      // ).properties.fill = am4core.color("#424242");
      // scrollbarX.stroke = am4core.color("#424242");
      // // chart.background.fill = am4core.color("#424242");
      // // chart.background.opacity = 0.5;

      // scrollbarX.strokeOpacity = 1;
      // // scrollbarX.hide();
      // chart.scrollbarX = scrollbarX;

      chart.events.on("ready", function() {
        // dateAxis.zoom({ start: 1, end: 1 });
      });
    });
  }

  ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.chart) {
        this.chart.dispose();
      }
    });
  }
}
