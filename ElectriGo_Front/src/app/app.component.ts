import { Component, ViewChild, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { concat, Observable } from 'rxjs';

import { MapComponent } from './components/map/map.component';
import { GeocoderService } from './services/geocoder.service';
import { RoutingService } from './services/routing.service';
import * as polyline from '@mapbox/polyline';
import { OverpassService } from './services/overpass.service';
import { VehiclesService } from './services/vehicles/vehicles.service';
import { SoapService } from './services/soap/soap.service';
import { RouteCostService } from './services/routeCost/route-cost.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ElectriGo';

  routeForm = this.fb.group({
    vehicle: ['', Validators.required],
    from: ['', Validators.required],
    to: ['', Validators.required]
  });

  vehicles!: any;

  waypoints_coords: number[][] = [];

  routeTime = 0;

  routeCost = 0;

  @ViewChild('myMap') myMap!: MapComponent;

  constructor(private fb: FormBuilder, private geocoder: GeocoderService, private routing: RoutingService, private overpass: OverpassService, private vehiclesService: VehiclesService, private soap: SoapService, private rest: RouteCostService) { }

  ngOnInit() {
    this.loadVehiclesList();
  }


  loadVehiclesList() {
    var uniqueVehicles: any[] = [];
    this.vehiclesService.getAllVehicles().subscribe((data: any) => {
      var actualVehicles = [];
      for (var vehicle of data) {
        if (!uniqueVehicles.includes(vehicle.naming.model)) {
          uniqueVehicles.push(vehicle.naming.model);
          actualVehicles.push(vehicle);
        }
      }
      this.vehicles = actualVehicles;
    });
  }

  routeSearch() {
    if (this.routeForm.invalid)
      return;

    var from: string = this.routeForm.get('from')!.value!;
    var to: string = this.routeForm.get('to')!.value!;

    this.myMap.resetLayer();
    this.waypoints_coords = [];

    concat(this.geocoder.search(from), this.geocoder.search(to)).subscribe({
      next: (data) => {
        this.waypoints_coords.push([data[0].lat, data[0].lon]);
        this.myMap.addMarker([data[0].lat, data[0].lon]);
      },
      complete: () => this.calculateRoute()
    });
  }

  calculateRoute() {
    this.routing.calculateRoute(this.waypoints_coords, true).subscribe((data: any) => {
      var total_distance = data.routes[0].distance;

      var first_route = polyline.decode(data.routes[0].geometry);

      var vehicleId: string = this.routeForm.get('vehicle')!.value!;

      console.log(vehicleId);

      var vehicleAutonomy = this.vehicles.find((element: any) => element.id == vehicleId).range.chargetrip_range.worst;

      var nb_stops = total_distance / (vehicleAutonomy * 1000);

      var nb_points_between_stops = Math.floor(first_route.length / nb_stops);

      var overpassRequests: Observable<number[] | null>[] = []

      for (var i = 1; i < nb_stops; i++) {
        var element = first_route[i * nb_points_between_stops];
        overpassRequests.push(this.overpass.nearestNodeAround("charging_station", element[0], element[1], 20000));
      }

      var critical_points: number[][] = [];
      concat(...overpassRequests).subscribe({
        next: (geoCode) => {
          if (geoCode == null)
            return;

          critical_points.push(geoCode);
          this.myMap.addMarker(geoCode, "bolt");
        },
        complete: () => {
          var last_marker = this.waypoints_coords.pop();

          this.waypoints_coords = this.waypoints_coords.concat(critical_points);
          this.waypoints_coords.push(last_marker!);

          this.routing.calculateRoute(this.waypoints_coords, true).subscribe((data: any) => {
            this.myMap.addRoute(polyline.decode(data.routes[0].geometry));
          });

          this.getRouteInfos(total_distance, nb_stops);

        }
      });
    });
  }

  getRouteInfos(total_distance: number, nb_stops: number) {
    console.log("distance : ", total_distance);
    this.soap.calculateRouteTime(total_distance, 100 * 1000, nb_stops).subscribe((e: number) => {
      this.routeTime = e;
    });

    this.rest.getRouteCost(total_distance).subscribe(e => this.routeCost = e);
  }

}
