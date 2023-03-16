import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RoutingService {

  constructor(private http: HttpClient) { }

  calculateRoute(waypoints: number[][], steps: boolean) {
    var coords = `${waypoints[0][1]},${waypoints[0][0]}`;
    for(var i = 1; i < waypoints.length; i++)
    coords += `;${waypoints[i][1]},${waypoints[i][0]}`;
    
    var url = `${environment.routingApiUrl}/driving/${coords}?steps=${steps}&overview=full`;
    return this.http.get(url);
  }
}
