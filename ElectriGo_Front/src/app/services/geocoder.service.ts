import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GeocoderService {

  constructor(private http: HttpClient) { }

  search(query: string): Observable<any> {
    return this.http.get(environment.geocoderApiUrl, {
      params: {
        q: query,
        format: "jsonv2"
      }
    });
  }

  reverseSearch(coords: number[]) {
    return this.http.get(`https://nominatim.openstreetmap.org/reverse?lat=${coords[0]}&lon=${coords[1]}&format=jsonv2`);
  }

  getNearestBornesFromPoint(coords: number[]) {
    var url = `${environment.borneApiUrl}?dataset=bornes-irve&rows=1&geofilter.distance=${coords[1]},${coords[0]}`;
    return this.http.get(url);
  }
}
