import { Component, OnInit, Inject } from '@angular/core';
// import { MatBottomSheetRef,MAT_BOTTOM_SHEET_DATA } from '@angular/material';

import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { SITESELECT } from '../pcs/pcs-Data';
import { DashboardService } from '../dashboard.service';
import { CloudpcsService } from '../cloudpcs.service';
import { ClouddeskService} from '../clouddesk.service';


interface formStructure {
  building: string,
  installed: number,
  working: number
}

@Component({
  selector: 'app-devices-on-sitebtm-page',
  templateUrl: './devices-on-sitebtm-page.component.html',
  styleUrls: ['./devices-on-sitebtm-page.component.scss']
})
export class DevicesOnSitebtmPageComponent implements OnInit {
  
  bottomForm: FormGroup;
  siteId: any;
  sensorTypes: string[] = ['Desk', 'Nova', 'Host', 'Day Light/Occupancy', 'WLAD'];
  SaleTypes: string[] = ['Demo', 'Production'];
  color = 'warn';
  sensorT: string [] = [];
  createForm(){
    this.bottomForm = this.fb.group({
      siteName:this.data,
      salesTypes:['', Validators.required],
      nova: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      desk: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      host: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      daylightOccupancy: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      wlad: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      shippingDate:['', Validators.required],
      time: new Date(),
      buildings:['', Validators.required]
    })
  }
  refreshForm(){
    this.bottomForm = this.fb.group({
      siteName:['', Validators.required],
      salesTypes:['', Validators.required],
      nova: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      desk: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      host: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      daylightOccupancy: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      wlad: this.fb.group({
        shippment:['', Validators.required],
        installed:['', Validators.required],
        working: ['', Validators.required]
      }),
      shippingDate:['', Validators.required],
      time: new Date(),
      buildings:['', Validators.required]
    })
  }

  constructor( private dashData: DashboardService , private NovaData: CloudpcsService, private DeskData: ClouddeskService, private fb: FormBuilder,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any, private bottomSheetRef: MatBottomSheetRef<DevicesOnSitebtmPageComponent>) {
    this.createForm();
  }
  siteSelect: SITESELECT [];
  loadingFlag: number;
  myFilter = (d: Date): boolean => {
    const day = d.getDay();
    // Prevent Saturday and Sunday from being selected.
    return day !== 0 && day !== 6;
  }
  ngOnInit() {
    this.loadingFlag = 1;
    this.siteSelect = [];
      this.dashData.getbuildingsAll(this.data)
        .subscribe((siteData: SITESELECT) => {
          this.siteSelect.push(siteData);
          this.loadingFlag = 0;
        })
  }

  siteSelectChange(event){
    this.loadingFlag = 1;
    this.dashData.getLocalSiteConfig({buildingId: event.value}).subscribe( (data: any[]) =>{
      if(data.length > 0 ) {
        this.bottomForm.patchValue(data[0]);
        }
        this.loadingFlag = 0;
        
      //  else {
      //   this.createForm();
      // }
    })

  }



  changeSelect(event) {
    this.loadingFlag = 1;
    let key;

    if( this.data == "adappt-cowrks" || this.data == "adappt-rmz" ) {
      key = true;
    } else {
      key = false;
    }
    // console.log(key, "key", this.data)
    for( let ev of event.value){
      console.log(ev)
      if(ev == 'Nova'){
        this.NovaData.getPcsCount({ subdomain:this.data, buildingId:this.bottomForm.value.buildings, key:key}).subscribe( (data: formStructure []) => {
          if(data.length > 0 && this.bottomForm.value.buildings == data[0].building) {
            // console.log(this.bottomForm,"nvoa",this.siteId)
            if( this.data == "adappt-cowrks" || this.data == "adappt-rmz" || this.data == "adappt-accenture" ) {
              let work = 0,installed = 0;
              data.map( d => {
                work +=d.working;
                installed +=d.installed
                this.bottomForm.controls[(ev).toLowerCase()].patchValue({installed:installed,working:work })
                this.bottomForm.get(`${(ev).toLowerCase()}.working`).disable({onlySelf:true})
                this.bottomForm.get(`${(ev).toLowerCase()}.installed`).disable({onlySelf:true})
                this.loadingFlag = 0;
              })
            } else {
              data.map( d => {
                this.bottomForm.controls[(ev).toLowerCase()].patchValue({installed:d.installed,working:d.working })
                this.bottomForm.get(`${(ev).toLowerCase()}.working`).disable({onlySelf:true})
                this.bottomForm.get(`${(ev).toLowerCase()}.installed`).disable({onlySelf:true})
                this.loadingFlag = 0;
              })
            }

          }
          
        })
      }
      if(ev == 'Desk'){
        this.loadingFlag = 1;
        this.DeskData.getDeskCount({ subdomain:this.data, buildingId:this.bottomForm.value.buildings, key:true}).subscribe( (data: formStructure []) => {
          if(data.length > 0 && this.bottomForm.value.buildings == data[0].building) {
            // console.log(this.bottomForm,"bottomForm",data)
            data.map( d => {
              this.bottomForm.controls[(ev).toLowerCase()].patchValue({installed:d.installed,working:d.working })
              this.bottomForm.get(`${(ev).toLowerCase()}.working`).disable({onlySelf:true})
              this.bottomForm.get(`${(ev).toLowerCase()}.installed`).disable({onlySelf:true})
              this.loadingFlag = 0;
            })
          }
        })
      }
      if(ev == 'Host'){
        this.loadingFlag = 1;
        this.dashData.getHostCount({ subdomain:this.data, buildingId:this.bottomForm.value.buildings, key: true}).subscribe( (data: formStructure []) => {
          if(data.length > 0 && this.bottomForm.value.buildings == data[0].building) {
            data.map( d => {
              this.bottomForm.controls[(ev).toLowerCase()].patchValue({installed:d.installed,working:d.working })
              this.bottomForm.get(`${(ev).toLowerCase()}.working`).disable({onlySelf:true})
              this.bottomForm.get(`${(ev).toLowerCase()}.installed`).disable({onlySelf:true})
              this.loadingFlag = 0;
            })
          }
        })
      }
      if( ev == 'daylightOccupancy'){
        
      }
      if( ev == 'wlad'){
  
      }
    
    }


  }

  saveData(){
    let obj = {};
    this.loadingFlag = 1;
    if(this.bottomForm.status ==="VALID"){
      // console.log(this.bottomForm.value)
      this.dashData.sendSensorConfig(this.bottomForm.value).subscribe( data =>{
                    console.log(data)
                    this.loadingFlag = 0;
                    this.bottomSheetRef.dismiss()
      })
    }
  }

  clearData(){
    this.bottomForm.reset({}, { onlySelf:false});
    
  }

}
