import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
@Injectable({
  providedIn: "root"
})
export class DashboardService {
  uri = "http://noc.adapptonline.com:3017";
  constructor(private http: HttpClient) {}

  getDomainList(): any {
    const obj = {};
    return this.http.post(`${this.uri}/api/dashboard/getDomainList`, obj);
  }

  getauthUser( uDetail): any {
    const obj = uDetail;
    return this.http.post(`${this.uri}/api/authUser`, obj)
  }

  createUser( obj): any {
    return this.http.post(`${this.uri}/api/createUser`, obj)
  }

  getUsers( uDetail= {}): any {
    return this.http.post(`${this.uri}/api/getUsers`, uDetail)
  } 
  
  updateUser( uDetail): any {
    return this.http.post(`${this.uri}/api/updateUser`, uDetail)
  } 

  getbuildingsAll(subdomain): any {
    const obj = {
      subdomain: subdomain
    };
    return this.http.post(`${this.uri}/api/buildings/getblgsShippment`, obj);
  }


  sendSensorConfig(obj) {
    return this.http.post(`${this.uri}/api/dashboard/sendSensorConfig`, obj);
  }

  getBuildingsLocations(obj) {
    return this.http.post(
      `${this.uri}/api/buildings/getBuildingsLocations`,
      obj
    );
  }

  getHostCount(obj) {
    return this.http.post(`${this.uri}/api/dashboard/getHostCount`, obj);
  }

  getLocalSiteConfig(obj) {
    return this.http.post(`${this.uri}/api/dashboard/getLocalSiteConfig`, obj);
  }

  getLocalSiteConfigSiteWise(obj) {
    return this.http.post(
      `${this.uri}/api/dashboard/getLocalSiteConfigSiteWise`,
      obj
    );
  }

  getlocalDbCount(obj) {
    return this.http.post(`${this.uri}/api/dashboard/getlocalDbCount`, obj);
  }
}
