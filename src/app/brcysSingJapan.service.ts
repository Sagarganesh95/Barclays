import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
// import { PCSTEMPLATE } from './pcs/pcs-Data';
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: "root"
})
export class BrcysSingJapan {
  uri = "http://noc.adapptonline.com:3017";
  private messageSource = new BehaviorSubject(false);
  msgBuilding = new BehaviorSubject("SGP-MBFC");
  currentMessage = this.messageSource.asObservable();
  curMsgBuilding = this.msgBuilding.asObservable();
  constructor(private http: HttpClient) {}

  changeBuildingName(building: string) {
    console.log(building);
    this.msgBuilding.next(building);
  }

  changeThemes(theme: boolean) {
    this.messageSource.next(theme);
    console.log(theme);
  }

  getBuilding(subdomain): any {
    const obj = {
      subdomain: subdomain
    };

    return this.http.post(`${this.uri}/api/buildings/getbarcFewbuildings`, obj);
  }

  getPlotPcs(fromDate, ToDate, id): any {
    const obj = {
      FromDate: fromDate,
      ToDate: ToDate,
      bleId: id
    };
    return this.http.post(`${this.uri}/barlcayssj/plotChartByBles`, obj);
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
    buildings
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
      buildings: buildings
    };
    return this.http.post(
      `${this.uri}/api/sensors/barlcayssj/getMinuteData`,
      obj
    );
  }

  getDatedPcsData(fromDate, ToDate, subdomain): any {
    const obj = {
      FromDate: fromDate,
      ToDate: ToDate,
      subdomain: subdomain
    };
    // console.log(obj)
    return this.http.post(`${this.uri}/api/sensors/barlcayssj/pcsData`, obj);
  }

  getpcsData(): any {
    return this.http.get(`${this.uri}/getPcsData`);
  }

  sendBleLogs(obj): any {
    console.log(obj);
    return this.http.post(
      `${this.uri}/api/sensors/barlcayssj/sendBleLogs`,
      obj
    );
  }

  getBleLogs(): any {
    // console.log(obj)
    return this.http.get(`${this.uri}/api/sensors/barlcayssj/getBleLogs`);
  }
  getBleSubject(): any {
    return this.http.get(`${this.uri}/api/sensors/barlcayssj/getBleSubject`);
  }

  getBleLogsByRmName(roomName): any {
    const obj = {
      roomName: roomName
    };
    return this.http.post(
      `${this.uri}/api/sensors/barlcayssj/getBleLogsByRmName`,
      obj
    );
  }

  getBleLogsForMail(bleAddress): any {
    const obj = {
      bleAddress: bleAddress
    };
    return this.http.post(
      `${this.uri}/api/sensors/barlcayssj/getBleLogsForMails`,
      obj
    );
  }

  sendBlelogsForMail(bleData): any {
    console.log(bleData, "bleData");
    return this.http.post(
      `${this.uri}/api/sensors/barlcayssj/sendMails`,
      bleData
    );
  }

  getBuildingCount(site, alias, timezone): any {
    const obj = {
      subdomain: site,
      building: alias,
      timezone: timezone
    };
    return this.http.post(
      `${this.uri}/api/sensors/barlcayssj/gethealthcount`,
      obj
    );
  }
}
