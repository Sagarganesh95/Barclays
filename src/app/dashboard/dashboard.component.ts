import {
  Component,
  OnInit
} from '@angular/core';
import * as moment from 'moment-timezone';
// import moment from 'moment-timezone'
import {
  ClouddeskService
} from '../clouddesk.service';
import {
  CloudpcsService
} from '../cloudpcs.service';
import {
  DashboardService
} from '../dashboard.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoadercomComponent } from '../loadercom/loadercom.component';
import { async } from '@angular/core/testing';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { WebSocketService } from '../web-socket.service';

interface formStructure {
  building: string,
    installed: number,
    working: number
}


interface localDataStruct {
  buildings: string,
    salesTypes: string,
    daylightOccupancy: localStoredData,
    desk: localStoredData,
    host: localStoredData,
    nova: localStoredData,
    shippingDate: Date,
    siteName: string,
    time: Date,
    wlad: localStoredData
}


interface tableStruct {
  id: number,
    siteName: string,
    deskCount: string,
    novacount: string,
    host: string,
    dlOccuSenCount: string,
    wlad: string,
    orderOrDemo: string,
    routePage: string
}

interface localStoredData {
  shippment: number,
    installed ? : number,
    working ? : number,
    siteName ? : string
}

interface buildingLocations {
  name: string,
  latitude: number,
  longitude: number,
  buildingId?: any
}


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {
  selected = [moment(), moment()];
  mapData = [];
  cards = [];
  tableArray: tableStruct[] = [];
  sitesName: string[] = [];
  tableData: any[];
  tableFilter = '';alive: boolean;
  tableFields = [{
      displayName: 'Unique Id',
      objectName: 'id',
      type: "ids"
    },
    {
      displayName: 'Site Name',
      objectName: 'siteName'
    },
    {
      displayName: 'Desk Sensor',
      objectName: 'deskCount'
    },
    {
      displayName: 'Nova Sensor',
      objectName: 'novacount',
    },
    {
      displayName: 'Host',
      objectName: 'host',

    },
    {
      displayName: 'D.L / Occu. Sensor',
      objectName: 'dlOccuSenCount',

    },
    {
      displayName: 'WLAD',
      objectName: 'wlad',

    },
    {
      displayName: 'Sale Type',
      objectName: 'orderOrDemo',

    },
    {
      displayName: "Actions",
      objectName: 'routePage',
      type: "routePage"
    }
  ];
  constructor(private ngxLoader: NgxUiLoaderService, private webSocketService: WebSocketService,
     private deskData: ClouddeskService, private pcsData: CloudpcsService, public snackBar: MatSnackBar,
     private dashboard: DashboardService, public dialog: MatDialog) { this.alive = true;}
     title = "Network Operations Center - 1.30.1";
  sidenavOpened = true;
  deskHealth: localStoredData[];
  novaHealth: localStoredData[];
  dayliHealth: localStoredData[];
  hostHealth: localStoredData[];
  wladHealth: localStoredData[];
  localData: localDataStruct[] = [];
  ttemp: tableStruct;
  flag: boolean;
  loading = true; 
  dialogRef;otherTheme: boolean;
  ngOnInit() {
    // this.webSocketService.listen('test event').subscribe( (data)=> {
    //   console.log(data,"data")
    // });

    this.pcsData.currentMessage.subscribe(message =>
      {
        this.otherTheme = message
      })

      this.startProg();

    // IntervalObservable.create(1000*60*10)
    // .takeWhile(() => this.alive)
    // .subscribe(() => { this.promptUser()} );
  }

  startProg() {
    this.ngxLoader.start();
    this.flag = false;
    this.cards = [];
    this.deskHealth = [];
    this.novaHealth = [];
    this.dayliHealth = [];
    this.hostHealth = [];
    this.wladHealth = [];
    this.tableData = [];
    this.dashboard.getDomainList().subscribe( data => {
      if( data.length > 0){ 
        this.sitesName =[ ...data];
        if( this.sitesName.length == data.length) {
          console.log(this.sitesName,"sitesName")
          this.getlocalDbCount();
          this.getBuildingsLocations();
          this.getDeskUnhealthyCount();  
          this.getPcsUnhealthyCount();
        } 
      }
    });
  }

  public promptUser(): any {
    let snackBarRef = this.snackBar.open(
      'Automatic Refresh for Every 10 minutes',
      'Thanks', {
        horizontalPosition: 'left'
      }
      );
      this.startProg(); console.log(new Date())
  };


  ngOnInitDestroy() {
    this.alive = false;
  }

  getlocalDbCount() {
    let counter = 0,pending = 0;
    this.sitesName.map(site => {
      ++counter;
      this.dashboard.getlocalDbCount({
        siteName: site
      }).subscribe((result: localDataStruct[]) => {
        ++pending
        if( result.length > 0){
          result.map(r => {
            this.localData.push(r)
          })
        }
        if (pending == counter) {
          this.getHostsUnhealthyCount();
          this.getDlOccuUnhealthyCount();
          this.getWladUnhealthyCount();
        }
      })
    })
  }


  getSensorConfigTable() {
    if(this.hostHealth.length == this.sitesName.length && this.novaHealth.length == this.sitesName.length &&
      this.deskHealth.length == this.sitesName.length && this.wladHealth.length <= this.sitesName.length && 
      this.dayliHealth.length <= this.sitesName.length){
        this.flag = true;
        if(this.flag == true){
          
          this.flag = false;
          let i = 0;
          
          for( let site of this.sitesName){
            this.ttemp = {
              id: 0,
              siteName: 'No Site',
              deskCount: `${ '0'+'/'+'0'}`,
              novacount: `${ '0'+'/'+'0'}`,
              host: `${ '0'+'/'+'0'}`,
              dlOccuSenCount: `${ '0'+'/'+'0'}`,
              wlad: `${ '0'+'/'+'0'}`,
              orderOrDemo: `${ 'N.A'}`,
              routePage: ''
            };
            this.ttemp.id = ++i;
            this.ttemp.siteName = site;
            for ( let host of this.hostHealth){
              if( host.siteName == site){
                this.ttemp.host = `${ host.working+'/'+host.installed}`;
              }
            }
            for( let nova of this.novaHealth){
              if( nova.siteName == site){
                this.ttemp.novacount = `${ nova.working+'/'+nova.installed}`;
              }
            }
            for( let desk of this.deskHealth){
              if( desk.siteName == site){
                this.ttemp.deskCount = `${ desk.working+'/'+desk.installed}`;
              }
            }
            for( let dayli of this.dayliHealth){
              if( dayli.siteName == site){
                this.ttemp.dlOccuSenCount = `${ dayli.working+'/'+dayli.installed}`;
              }
            }
            for( let wlad of this.wladHealth){
              if( wlad.siteName == site){
                this.ttemp.wlad = `${ wlad.working+'/'+wlad.installed}`;
              }
            }
            for( let loc of this.localData) {
              if( loc.siteName == site){
                this.ttemp.orderOrDemo = loc.salesTypes
              }
            }
            this.tableData.push(this.ttemp);
          }
          this.cards.sort( (a, b)=> {
            if(a.name < b.name) { return -1; }
            if(a.name > b.name) { return 1; }
            return 0;
          });
          this.loading = false;
          this.ngxLoader.stop();
        }
    }else{
      console.log("this.hostHealth",this.hostHealth.length, "this.novaHealth",this.novaHealth.length, "this.deskHealth", 
      this.deskHealth.length, "this.wladHealth", this.wladHealth.length,"this.dayliHealth", this.dayliHealth.length )
    }
  }


  getBuildingsLocations() {
    this.sitesName.map(m => {
      this.dashboard.getBuildingsLocations({
        subdomain: m
      }).subscribe((data: buildingLocations []) => {
        if (data.length > 0) {
          for( let d of data) {
            if(!d.longitude || !d.latitude){
              d.longitude = 0;
              d.latitude = 0;
            }
            this.mapData.push(d)
          }
        }
      })
    })

  }

  getHostsUnhealthyCount() {
    let working = 0,
      installed = 0,
      shippment = 0,
      counter = 0,
      pending = 0;

    this.sitesName.map(m => {
      ++counter;
      working = 0,installed = 0,shippment = 0;
      this.dashboard.getHostCount({
        subdomain: m,
        buildingId: "",
        key: false
      }).subscribe(async (data: formStructure[]) => {
        let temp: localStoredData = {
          installed: 0,
          shippment: 0,
          working: 0,
          siteName: ''
        };
        temp.siteName = m;
        if (data.length > 0) {
          for await ( let d of data){
            working += d.working;
            installed += d.installed;
            temp.installed = d.installed;
            temp.working = d.working;
            if (counter == ++pending) {
              if (this.localData.length > 0) {
                for ( let l of this.localData){
                  shippment = shippment + l.host.shippment;
                  if (l.siteName == m) {
                    temp.shippment = temp.shippment + l.host.shippment;
                  }
                }
              }
            }
          }
          this.hostHealth.push(temp);
          if(this.hostHealth.length == this.sitesName.length){
            this.getSensorConfigTable();
            this.cards.push({
              name: "Hosts",
              chartName: "host",
              routeLink: '/host-data',
              data1: [{
                  name: "Working",
                  full: "100",
                  value: (working / installed * 100)
                }, {
                  name: "Installed",
                  full: "100",
                  value: (installed / shippment * 100)
                },
                {
                  name: "Shipment",
                  full: "100",
                  value: (shippment / shippment * 100)
                }
              ]
            })
          }
        } else {
          this.hostHealth.push(temp);
        }
      })
    })
  }

  getDlOccuUnhealthyCount() {
    let working = 0,
      installed = 0,
      shippment = 0,
      counter = 0,
      pending = 0;
    // if (this.localData.length > 0) {
    // }
    for( let site of this.sitesName){
      ++counter;
      let temp: localStoredData = {
        installed: 0,
        shippment: 0,
        working: 0,
        siteName: ''
      };
      // console.log(site, "daylight")
      working = 0,installed = 0,shippment = 0;
      this.dashboard.getBuildingsLocations({
        subdomain: site
      }).subscribe((data: buildingLocations []) => {
          ++pending;
          
          if (data.length > 0) {
            temp.siteName = site;
            data.map( bul => {
              for( let l of this.localData) {
                if( site == l.siteName) {
                  if( bul.buildingId == l.buildings) {
                    shippment = shippment + l.daylightOccupancy.shippment;
                    working = working + l.daylightOccupancy.working;
                    installed = installed + l.daylightOccupancy.installed;
                    temp.installed = installed;
                    temp.shippment = shippment;
                    temp.working = working;
                  }
                }
              }
            })
            this.dayliHealth.push(temp);
          }
          // console.log(pending, counter)
          if(pending == counter) {
            this.cards.push({
              name: "D.L/Occupancy",
              chartName: "daylight",
              routeLink: '/pcs-data',
              data1: [
        
                {
                  name: "Working",
                  full: "100",
                  value: (working / installed * 100)
                }, {
                  name: "Installed",
                  full: "100",
                  value: (installed / shippment * 100)
                },
                {
                  name: "Shipment",
                  full: "100",
                  value: (shippment / shippment * 100)
                }
              ]
            })
          }
        })
    }
  }
  getWladUnhealthyCount() {
    let working = 0,
      installed = 0,
      shippment = 0,
      counter = 0,
      pending = 0;
    // if (this.localData.length > 0) {
      
    // }
        for( let site of this.sitesName){
          ++counter;
          let temp: localStoredData = {
            installed: 0,
            shippment: 0,
            working: 0,
            siteName: ''
          };
          working = 0,installed = 0,shippment = 0;
          this.dashboard.getBuildingsLocations({
            subdomain: site
          }).subscribe((data: buildingLocations []) => {
              ++pending;
              if (data.length > 0) {
                temp.siteName = site;
                data.map( bul => {
                  for( let l of this.localData) {
                    if( site == l.siteName) {
                      if( bul.buildingId == l.buildings) {
                        shippment = shippment + l.wlad.shippment;
                        working = working + l.wlad.working;
                        installed = installed + l.wlad.installed;
                        temp.installed = installed;
                        temp.shippment = shippment;
                        temp.working = working;
                      }
                    }
                  }
                })
                this.wladHealth.push(temp);
              }
              if(pending == counter) {
                this.cards.push({
                  name: "WLAD",
                  chartName: "wlad",
                  routeLink: '/pcs-data',
                  data1: [
            
                    {
                      name: "Working",
                      full: "100",
                      value: (working / installed * 100)
                    }, {
                      name: "Installed",
                      full: "100",
                      value: (installed / shippment * 100)
                    },
                    {
                      name: "Shipment",
                      full: "100",
                      value: (shippment / shippment * 100)
                    }
                  ]
                })
              }
            })
        }
    

  }

  getPcsUnhealthyCount() {
    let counter = 0, pending = 0;
    for( let site of this.sitesName){
      ++counter;
      this.pcsData.getPcsCount({
        subdomain: site,
        buildingId: "",
        key: false
      }).subscribe(async (data: formStructure[]) => {
        ++pending;
        let temp: localStoredData = {
          installed: 0,
          shippment: 0,
          working: 0
        };
        temp.siteName = site;
        if (data.length > 0) {
          temp = await this.dataLoop(data, temp);
          if(this.localData.length > 0){
            temp = await this.localDataLop(this.localData, temp, site)
          }
          this.novaHealth.push(temp);
        } else {
          this.novaHealth.push(temp);
        }
        if (counter == pending) {
          let working = 0, installed = 0, shippment = 0;
          for( let nova of this.novaHealth) {
            working += nova.working;
            installed += nova.installed;
            shippment += nova.shippment;
          }
          this.cards.push({
            name: "Nova",
            chartName: "nova",
            routeLink: '/pcs-data',
            data1: [{
                name: "Working",
                full: "100",
                value: (working / installed * 100)
              }, {
                name: "Installed",
                full: "100",
                value: (installed / shippment * 100)
              },
              {
                name: "Shipment",
                full: "100",
                value: (shippment / shippment * 100)
              }
            ]
          })
        }
        if( ( counter == pending) && (this.novaHealth.length == this.sitesName.length) ){
          // console.log("pcs entry")
          this.getSensorConfigTable();
        }
        if(pending == this.sitesName.length){
        }
      })
    }
  }


  
  async dataLoop(data:formStructure [], temp: localStoredData) {
    let working = 0, installed = 0;
    for( let d of data){
      working = working + d.working;
      installed = installed + d.installed;
      temp.installed = installed;
      temp.working = working;
    }
    return temp;
  }

  async localDataLop( localData: localDataStruct[], temp: localStoredData, site: string ) {
    let  shippment = 0;
    localData.map(l => {
      if( l.siteName == site) {
        shippment = shippment + l.nova.shippment;
        temp.shippment = shippment;
      }
    })
    return temp;
  }


  getDeskUnhealthyCount() {
    let counter = 0, pending = 0;
    let working = 0, installed = 0, shippment = 0;
    this.sitesName.map(m => {
      ++counter;
      this.deskData.getDeskCount({
        subdomain: m,
        buildingId: "",
        key: false
      }).subscribe((data: formStructure[]) => {
        ++pending;
        let temp: localStoredData = {
          installed: 0,
          shippment: 0,
          working: 0,
          siteName: ''
        };
        
        if (data.length > 0) {
          temp.siteName = m;
          for ( let d of data){
            working += d.working;
            installed += d.installed;
            temp.installed += d.installed;
            temp.working += d.working;
          };
          this.deskHealth.push(temp)
        } else {
          this.deskHealth.push(temp)
        }
        if ( (counter == pending) && (this.deskHealth.length == this.sitesName.length) ) {
          if (this.localData.length > 0) {
            for( let l of this.localData){
              shippment = +l.desk.shippment;
              if( m == l.siteName) {
                temp.shippment = l.desk.shippment;
              }
            }
          }
          this.cards.push({
            name: "Desk",
            chartName: "desk",
            routeLink: '/desk-data',
            data1: [{
                name: "Working",
                full: "100",
                value: (working / installed * 100)
              }, {
                name: "Installed",
                full: "100",
                value: (installed / shippment * 100)
              },
              {
                name: "Shipment",
                full: "100",
                value: (shippment / shippment * 100)
              }
            ]
          })
          this.getSensorConfigTable(); 
        }
        
      })

    })
  }

  // tableFilter;

  sensorTypes(item) {
    this.cards.forEach(element => {
      if (element.name == item.name)
        item.isActive = true
    });
  }
}
