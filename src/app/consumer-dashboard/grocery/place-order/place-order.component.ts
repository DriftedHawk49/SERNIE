import { Component, OnInit } from '@angular/core';
import { MainMapService } from 'src/app/main-map.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SpecificShopSelectorService } from 'src/app/specific-shop-selector.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place-order',
  templateUrl: './place-order.component.html',
  styleUrls: ['./place-order.component.scss']
})
export class PlaceOrderComponent implements OnInit {

  constructor(private router: Router , private dataSettingService: SpecificShopSelectorService, private mapService: MainMapService, private _snackbar: MatSnackBar) { }

  realPayload = [];
  loading:boolean = true;
  expression:boolean = true;

  getServiceProviders(){
    const service = "Grocery Shop";
    let pincode,zone,lat,lng;
    if(window.localStorage.isLoggedIn){
      pincode = window.localStorage.getItem("pincode");
      zone = window.localStorage.getItem("zone");
      lat = window.localStorage.getItem("lat");
      lng = window.localStorage.getItem("lng");
    } else if(window.sessionStorage.isLoggedIn){
      pincode = window.sessionStorage.getItem("pincode");
      zone = window.sessionStorage.getItem("zone");
      lat = window.sessionStorage.getItem("lat");
      lng = window.sessionStorage.getItem("lng");
    }

    fetch(`http://localhost:5000/api/servicegetter?serviceType=${service}&pincode=${pincode}&zone=${zone}&lat=${lat}&lng=${lng}`,{
      method: 'GET'
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{

      if(arg.success){
        
        const origin = new google.maps.LatLng(lat,lng);
        let destinations = [];
        for(let sp of arg.payload){
          destinations.push(new google.maps.LatLng(sp.lat,sp.lng));
          
        }
        const distanceService = new google.maps.DistanceMatrixService();
        distanceService.getDistanceMatrix({
          origins: [origin],
          destinations: destinations,
          travelMode: google.maps.TravelMode.WALKING
        },(response,status)=>{
          if(status=="OK"){
            
            const origins = response.originAddresses;
            for(let i=0; i<origins.length;i++){
              let results = response.rows[i].elements;
              for(let j=0;j<results.length;j++){
                let element = results[j];
                let distance = element.distance.value;
                arg.payload[j].distance = Number(distance);

                
              }
            }
            arg.payload.sort(function(a,b){return a.distance-b.distance});

            this.realPayload = arg.payload;

            this.loading = false;
            this._snackbar.open("Shops present in your neighborhood!","Ok",{duration:2000});
          }
        });
      }else {
        this._snackbar.open("Server Error. Try Again Later","OK",{duration: 2000});
      }
    })
  }

  trackFn(index:number, element:any){
    return element?element.id:null;
  }

  placeOrderWindow(index){
    this.dataSettingService.data.id = this.realPayload[index].id;
    this.dataSettingService.data.shopName = this.realPayload[index].shopName;
    this.dataSettingService.data.shopAddress = this.realPayload[index].shopAddress;
    this.router.navigate(['grocery/placeorder']);
  }



  ngOnInit() {
    this.getServiceProviders();
  }

}
