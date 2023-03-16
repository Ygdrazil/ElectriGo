import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SoapService {



  constructor(private httpClient: HttpClient) { }

  calculateRouteTime(distanceM: number, speedMPerHour: number, stops: number) {
    console.log(distanceM, speedMPerHour, stops);

    var request = "<soapenv:Envelope xmlns:soapenv='http://schemas.xmlsoap.org/soap/envelope/' xmlns:spy='spyne.electrigo.duree.soap'>"
      + "<soapenv:Header/>"
      + "<soapenv:Body>"
      + "<spy:calculDuree>"
      + "<spy:distance>" + distanceM + "</spy:distance>"
      + "<spy:vitesse_moyenne>" + speedMPerHour + "</spy:vitesse_moyenne>"
      + "<spy:nb_stops>" + stops + "</spy:nb_stops>"
      + "</spy:calculDuree>"
      + "</soapenv:Body>"
      + "</soapenv:Envelope>";


    return this.httpClient.post<any>(environment.soapUrl, request, { responseType: "text" as "json" }).pipe(
      map((data: any) => {
        //Get the return value
        let res = data.split("calculDureeResult");
        res = res[1];
        res = res.replace(">", "");
        res = res.replace("</tns:", "");

        return res;
      })
    );
  }
}
