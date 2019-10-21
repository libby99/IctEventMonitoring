import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
    headers: HttpHeaders;

  constructor(private http: HttpClient) {
    this.headers= new HttpHeaders({
   //  crossDomain: "true",
   //   dataType : 'jsonp'
    })
  }

  getApiData(postData) {
    return this.http.post("http://ictapi/resource.php", postData);
  }

  getSessionEvents(url) {
    // let params = "http://49.50.253.44:50501/PRT_CTRL_DIN_ISAPI.dll?Command&Type=Session&SubType=InitSession&SessionID=<SessionID>";
    return this.http.get("http://ictapi/getsession?" + url, { headers: this.headers });
  }

}
