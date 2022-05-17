import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CloudHostService {

  constructor( private http: HttpClient) { }
  uri = "http://noc.adapptonline.com:3017";

  getHostData( fromDate, toDate, subdomain): any {
    const obj = {
      FromDate: fromDate,
      ToDate: toDate,
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/hosts/getHostLogsData`, obj)
  }

  getbuildingsAllForHost(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/getbuildingsAllForHost`, obj);
  }


  

  getDateForHost(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/getDateForHost`, obj);
  }


  getHostUnhelathyTrend(site, alias, timezone,timezoneOffset, selecttype, favoriteType, selectedDate): any {
    const obj = {
      subdomain: site,
      building: alias,
      timezone: timezone,
      timezoneOffset: timezoneOffset,
      selecttype: selecttype,
      favoriteType: favoriteType,
      selectedDate: selectedDate
    };
    return this.http.post(`${this.uri}/api/hosts/getHostUnhelathyTrend`, obj);
  }


  getHostComplients(hostId): any {
    const obj = {
      hostId: hostId
    };
    return this.http.post(`${this.uri}/api/hosts/getHostComplaints`, obj);
  }

}
