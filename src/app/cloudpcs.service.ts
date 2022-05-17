import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { PCSTEMPLATE } from './pcs/pcs-Data';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class CloudpcsService {
  uri = "http://noc.adapptonline.com:3017";
  private messageSource = new BehaviorSubject(false);
  msgBuilding = new BehaviorSubject("");
  currentMessage = this.messageSource.asObservable();
  curMsgBuilding = this.msgBuilding.asObservable();
  constructor(private http: HttpClient) {}

  changeBuildingName(building: string) {
    console.log(building);
    this.msgBuilding.next(building);
  }

  changeThemes(theme: boolean) {
    this.messageSource.next(theme);
    // console.log(theme)
  }

  getBuilding(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/all`, obj);
  }

  getbuildingsAll(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/getbuildingsAll`, obj);
  }

  getLiveData(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/sensors/getLiveData`, obj);
  }

  getPlotPcs(fromDate, ToDate, id): any {
    const obj = {
      FromDate: fromDate,
      ToDate: ToDate,
      bleId: id
    };
    return this.http.post(`${this.uri}/plotChartByBles`, obj);
  }

  getPlotMins(
    fromDate,
    ToDate,
    id,
    subdomain,
    blgtimezone,
    blgoffset,
    roomName,
    bleAddress,
    floors,
    buildings,
    selecttype
  ): any {
    const obj = {
      FromDate: fromDate,
      ToDate: ToDate,
      bleId: id,
      subdomain: subdomain,
      blgtimezone: blgtimezone,
      blgoffset: blgoffset,
      roomName: roomName,
      bleAddress: bleAddress,
      floors: floors,
      buildings: buildings,
      selecttype: selecttype
    };
    return this.http.post(`${this.uri}/api/sensors/getMinuteData`, obj);
  }

  getDatedPcsData(fromDate, ToDate, subdomain): any {
    const obj = {
      FromDate: fromDate,
      ToDate: ToDate,
      subdomain: subdomain
    };
    console.log(obj)
    return this.http.post(`${this.uri}/api/sensors/pcsData`, obj);
  }

  getpcsData(): any {
    return this.http.get(`${this.uri}/getPcsData`);
  }

  sendBleLogs(obj): any {
    console.log(obj);
    return this.http.post(`${this.uri}/api/sensors/sendBleLogs`, obj);
  }
  resolveBleLogs(obj): any {
    // console.log(obj)
    return this.http.post(`${this.uri}/api/sensors/resolveBleLogs`, obj);
  }
  getBleLogs(): any {
    // console.log(obj)
    return this.http.get(`${this.uri}/api/sensors/getBleLogs`);
  }
  getBleSubject(): any {
    return this.http.get(`${this.uri}/api/sensors/getBleSubject`);
  }

  getBleLogsByRmName(areaName): any {
    const obj = {
      areaName: areaName
    };
    return this.http.post(`${this.uri}/api/sensors/getBleLogsByRmName`, obj);
  }

  getBleLogsForMail(bleAddress): any {
    const obj = {
      bleAddress: bleAddress
    };
    return this.http.post(`${this.uri}/api/sensors/getBleLogsForMails`, obj);
  }

  sendBlelogsForMail(bleData): any {
    // console.log(bleData,"bleData")
    return this.http.post(`${this.uri}/api/sensors/sendMails`, bleData);
  }


  getDateForSensors(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/getDateForSensors`, obj);
  }

  getBuildingCount(site, alias, timezone,timezoneOffset, selecttype, favoriteType, selectedDate): any {
    const obj = {
      subdomain: site,
      building: alias,
      timezone: timezone,
      timezoneOffset: timezoneOffset,
      selecttype: selecttype,
      favoriteType: favoriteType,
      selectedDate: selectedDate
    };
    return this.http.post(`${this.uri}/api/sensors/gethealthcount`, obj);
  }

  getPcsCount(obj) {
    // console.log(obj)
    return this.http.post(`${this.uri}/api/sensors/getPcsCount`, obj);
  }

  scheduleMails() {
    return this.http.get(`${this.uri}/api/sensors/scheduleMails`);
  }

}
