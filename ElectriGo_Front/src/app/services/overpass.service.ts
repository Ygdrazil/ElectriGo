import { Injectable } from '@angular/core';
import { from, mergeMap, Observable } from 'rxjs';
import type { OverpassJson } from "overpass-ts";
import { overpass } from "overpass-ts";

@Injectable({
  providedIn: 'root'
})
export class OverpassService {

  constructor() { }

  public nearestNodeAround(amenity: String, lat: number, long: number, radius: number): Observable<number[] | null> {
    const obs = from(overpass(`[out:json];node[amenity=${amenity}] (around:${radius},${lat},${long});out;`));
    return obs.pipe(mergeMap(async (data) => {
      var json = await data.json();
      return this.findNearestNode(lat, long, json);
    }));
  }


  private findNearestNode(lat: number, long: number, overpassResponse: any): number[] | null {

    if (overpassResponse.elements.length == 0)
      return null;

    var nearestNode = overpassResponse.elements[1];
    var nearestNodeDistance = Math.pow(lat - nearestNode.lat, 2) + Math.pow(long - nearestNode.lon, 2);
    for (var i = 1; i < overpassResponse.elements.length; i++) {
      var element = overpassResponse.elements[i];
      var currentDistance = Math.pow(lat - element.lat, 2) + Math.pow(long - element.lon, 2);

      if (currentDistance < nearestNodeDistance) {
        nearestNode = element; nearestNodeDistance = currentDistance;
      }
    }

    return [nearestNode.lat, nearestNode.lon];
  }
}
