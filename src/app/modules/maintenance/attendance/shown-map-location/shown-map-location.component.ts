import { Size } from "@agm/core/services/google-maps-types";
import { Component, Input, OnChanges, SimpleChanges, ViewChild } from "@angular/core";
import { MapInfoWindow, MapMarker } from "@angular/google-maps";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-shown-map-location",
  templateUrl: "./shown-map-location.component.html",
  styleUrls: ["./shown-map-location.component.scss"],
})
export class ShownMapLocationComponent implements OnChanges {


  mapOptions: google.maps.MapOptions = {
    center: { lat: 3.140853, lng: 101.693207 },
    zoom: 5,
  };
  imgUrl: any = environment.apiUrl;
  @Input() longitude: number = 101.693207;
  @Input() latitude: number = 3.140853;
  @Input() typeChecking: any;
  @Input() userData: any = [];
  markers: any = []
  zoom: number = 12;

  infoWindowOpen: any = ''
  ngOnChanges(changes: SimpleChanges): void {
    console.log(this.userData, "userData")
    this.mapOptions = {
      center: {
        lat: Number(this.latitude),
        lng: Number(this.longitude)
      },
      zoom: 17,
    };
    this.markers.push(
      {
        lat: Number(this.latitude),
        lng: Number(this.longitude),

      },
    );



    this.infoWindowOpen = this.typeChecking
  }


  getMarkerIcon(type: number = 0): google.maps.Icon {
    const iconUrl = type == 0 ? 'assets/images/green-dot.png' : 'assets/images/yellow-dot.png';
    const size: Size = {
      width: 50,
      height: 50,
      equals: (other: Size) => other.width === size.width && other.height === size.height,
    };

    return {
      url: iconUrl,
      scaledSize: size,
    };
  }


  @ViewChild(MapInfoWindow) infoWindow: MapInfoWindow;
  infoWindowOptions: google.maps.InfoWindowOptions = {
    pixelOffset: { width: 0, height: -30 } as Size
  };
  openInfoWindow(windowType: string) {
    console.log(windowType, "gg")


  }

  closeInfoWindow() {
    this.infoWindowOpen = null;

  }


  openInfoWindow_newInfo(marker: MapMarker, windowType: any) {
    this.infoWindowOpen = windowType;
    this.infoWindow?.open(marker);
  }

}
