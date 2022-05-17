import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable({
  providedIn: "root"
})
export class ClouddeskService {
  uri = "http://noc.adapptonline.com:3017";
  constructor(private http: HttpClient) {}

  getDatedDeskData(fromDate, ToDate, subdomain): any {
    const obj = {
      FromDate: fromDate,
      ToDate: ToDate,
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/desksensor/deskData`, obj);
  }
  getBleLogs(): any {
    // console.log(obj)
    return this.http.get(`${this.uri}/api/sensors/getBleLogs`);
  }

  getPlotMins(
    fromDate,
    ToDate,
    id,
    subdomain,
    blgtimezone,
    blgoffset,
    deskName,
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
      roomName: deskName,
      bleAddress: bleAddress,
      floors: floors,
      buildings: buildings,
      selecttype: selecttype
    };
    return this.http.post(`${this.uri}/api/sensors/getMinuteData`, obj);
  }

  getbuildingsAll(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/getbuildingsAll`, obj);
  }

  getBleLogsForMail(bleAddress): any {
    const obj = {
      bleAddress: bleAddress
    };
    return this.http.post(`${this.uri}/api/sensors/getBleLogsForMails`, obj);
  }

  sendBlelogsForMail(bleData): any {
    console.log(bleData, "bleData");
    return this.http.post(`${this.uri}/api/sensors/sendMails`, bleData);
  }

  getDeskCount(obj) {
    console.log(obj)
    return this.http.post(`${this.uri}/api/desksensor/getDeskCount`, obj);;
  }
}
