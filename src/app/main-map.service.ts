/// <reference types="@types/googlemaps" />

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainMapService {


// Initializes the map and returns the map object
  mapInit(srcObj, initLocation){
    var mapProp = {
      center: new google.maps.LatLng(initLocation.lat,initLocation.lng),
      zoom: 14,
      disableDefaultUI: true
    }

    return new google.maps.Map(srcObj,mapProp);
  }

// Add marker on the given map on a given position, returns marker object
  addMarker(map, position, customMarker = null){
    if(customMarker==null){
      return new google.maps.Marker({
        position: position,
        map : map
      });
    } else {
      return new google.maps.Marker({
        position: position,
        map: map,
        icon: customMarker
      });
    }
    
  }

  // Removes the marker from the map
  removeMarker(marker){
    marker.setMap(null);
  }

// animates the marker and stops animation after 2 seconds
  animateMarker(marker){
    marker.setAnimation(google.maps.Animation.BOUNCE);
    setTimeout(()=>{
      marker.setAnimation(null);
    }, 2000);
  }



  constructor() { }
}
