import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ChartModule } from '../pcs/pcs-Data';
import { CloudpcsService } from '../cloudpcs.service';
import { BrcysSingJapan } from '../brcysSingJapan.service';
import { CloudHostService } from '../cloud-host.service';
// const EXPANSION_PANEL_ANIMATION_TIMING: "225ms cubic-bezier(0.4,0.0,0.2,1)";
@Component({
  selector: 'app-amcharts',
  templateUrl: './amcharts.component.html',
  styleUrls: ['./amcharts.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class AmchartsComponent implements OnInit {

  constructor( private pcsData: CloudpcsService, private brcySer: BrcysSingJapan, private cdRef: ChangeDetectorRef, private hostData: CloudHostService) { }
  OpenStateTrend = false;
  OpenStateOfBuilding = true;
  buildigname: string;
  step = -1;
  expanded = true;
  // typeData;
  favoriteType: string;
  @Input() masterArray : ChartModule[];
  @Input() unhealthyMaster: ChartModule [] = [];
  @Input() selected: any;
  @Input() selecttype: any;
  @Input() sensorType: any;flag;
  selectedDate= {
    begin: new Date(),
    end: new Date()
  };
  trendDates = {
    begin: "",
    end: ""
  };
  selectedDates = {
    begin: new Date(),
    end: new Date()
  };
  typeArray: string[] = ['LastWeek', 'LastMonth', 'FromBeginning'];
  
  ngOnInit() {
    this.flag = ""
    this.favoriteType = 'LastWeek';
    if(this.unhealthyMaster.length > 0){
      this.OpenStateTrend = false;
      this.OpenStateOfBuilding = true;
      this.step++;
    }

    if(this.selecttype == 'PIR'){
      this.brcySer.msgBuilding.subscribe( building => {
        this.buildigname = building;
      }) 
    } else {
      this.pcsData.msgBuilding.subscribe( building => {
        this.buildigname = building;
      })
    }

     
    
  }


  trendDate($event){
    let obj = $event;
    this.trendDates.begin = obj.begin;
    this.trendDates.end = obj.end;
    // console.log(this.trendDates, obj)
  }

  public onDate(): void {
    this.selectedDate = this.selectedDates;
    console.log(this.selectedDate);
  }

  foo(event: Event, type) {
    event.stopPropagation();
    this.favoriteType = type;
    // console.log(this.favoriteType,"type");
    this.cdRef.detectChanges();
  }

  receiveMessage(count){
    // console.log(count);
    this.step = count;
    this.pcsData.msgBuilding.subscribe( building => {
      this.buildigname = building;
    })
  }

  stepdata(val){
    this.step = val;
  }



}
