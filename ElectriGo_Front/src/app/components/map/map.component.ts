import { AfterViewInit, Component } from '@angular/core';
import * as L from 'leaflet';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41]
});

const iconCharging = L.icon({
  iconUrl: 'assets/bolt.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]});

L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements AfterViewInit {
  private map!: L.Map;
  private layerGroup = L.layerGroup();

  private apiKey = "pk.eyJ1IjoieWdkcmF6aWwiLCJhIjoiY2xleW5xY3lrMDFtdzN4czNzdm5hYmZlayJ9._cXbuQyKfq0f8b-_W4MGWg";

  constructor() {}

  private initMap(): void {

    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3
    });

    const tiles = L.tileLayer(`https://api.mapbox.com/styles/v1/ygdrazil/cleyntmji000z01s4sa53ktnc/tiles/256/{z}/{x}/{y}?access_token=${this.apiKey}`, {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });

    tiles.addTo(this.map);
    this.layerGroup.addTo(this.map);
  }

  addMarker(latLng: Array<number>, icon: "default" | "bolt" = "default") {
    L.marker([latLng[0], latLng[1]], { icon: icon == "default" ? iconDefault : iconCharging }).addTo(this.layerGroup);
  }

  addRoute(route: L.LatLngExpression[]) {
    var line = L.polyline(route, {color: 'red'}).addTo(this.layerGroup);
    this.map.fitBounds(line.getBounds());
  }

  resetLayer() {
    this.layerGroup.clearLayers();
  }

  ngAfterViewInit() {
    this.initMap();
  }
}
