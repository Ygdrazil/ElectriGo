import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RouteCostService {

  constructor(private httpClient: HttpClient) { }

  getRouteCost(totalDistanceM: number) {
    return this.httpClient.post(`${environment.restApiUrl}/cost`, {distance: totalDistanceM})
          .pipe(map((e: any) => e.cost));
  }
}
