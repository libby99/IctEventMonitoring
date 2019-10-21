import { Component, OnInit } from '@angular/core';
import { ApiService } from './api.service';
declare const getPosition: any;
declare const convertToObject: any;
declare const specialChars: any;
declare const displayDateTime: any;
declare const runQuery: any;
declare const decryptAES: any;
declare const encryptAES: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent implements OnInit {
  dataToPost: { Username: string; Password: string; IPAddress: string; ControllerIPAddress: string; };
  timer;
  servertype = 1;
  sequence = 0;
  hasEvent: boolean = true;
  events = [];
  constructor(
    public apiService: ApiService
  ) {
    this.dataToPost =
      {
        Username: "apitest",
        Password: "pT}'Ejwc-FY7<<B~",
        IPAddress: "49.50.253.44:50501",
        ControllerIPAddress: "49.50.253.44:50501"
      }
  }

  ngOnInit() {
    this.getAuthData();
    this.eventReportInit();
  }

  getAuthData() {
    this.apiService.getApiData(this.dataToPost).subscribe(
      (res) => {
 //       console.log(res);
        localStorage.setItem("WXKey", res["AESKEY"]);
        localStorage.setItem("SESSID", res["SESSID"]);
        this.sequence = res["seq"];
      },
      (err) => { console.warn(err) }
    )
  }

  getEventsData(encParams: string, type: string) {
    this.apiService.getSessionEvents(encParams).subscribe(
      (res) => {
//        console.log(res);
        this.getEvents(res, type);
      },
      (err) => { console.warn(err) }
    )
  }

  eventsQuery(url: string, params: string, type: string) {
    let encryptedParams = encryptAES(params + "&Sequence=" + this.sequence);
    this.sequence++;
    this.getEventsData(url + encryptedParams, type);
  }

  getEvents(encRes, type) {
    let res = decryptAES(encRes); 

    if (res === "<no response>" && type == "latest")
      this.hasEvent = false;

    if (res.substr(0, 5) == "Event") {
      let eventobj = convertToObject(res);
      let e, c, k, g;

      for (e in eventobj)
        if (e.substr(0, 5) == "Event") {
//          let b = e.substr(5);
          if (e.substr(0, 9) != "EventCode") {
            c = getPosition(eventobj[e], " ", 3) + 1;
            k = eventobj[e].substr(0, c);
            g = eventobj[e].substr(c);
            g = specialChars(g, "replace").replace("OFFLINE USER 00000", "WX Operator");
//            console.log("Description:" + g + "Time:" + displayDateTime(k, "WX"));
            this.events.unshift({ description: g, time: displayDateTime(k, "WX") });
          }
        }
    }
  }

  requestEvents(eventType: string) {
    let url = "http://49.50.253.44:50501/PRT_CTRL_DIN_ISAPI.dll?",
      params = "Request&Type=Events&SubType=" + eventType;

    this.eventsQuery(url, params, eventType);
    eventType == "Previous" && clearInterval(this.timer);
  }

  eventReportInit() {
    this.timer ? clearTimeout(this.timer) : null;
    this.requestEvents("Latest");
    this.timer = setInterval(() => this.requestEvents("Update"), 2E3);
  }

  restartMonitoring() {
    this.requestEvents("Latest");
    this.timer = setInterval(() => this.requestEvents("Update"), 2E3);
  }
}
