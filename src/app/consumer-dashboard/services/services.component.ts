
import { Component, OnInit } from '@angular/core';
import { MainMapService } from 'src/app/main-map.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-services',
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.scss']
})
export class ServicesComponent implements OnInit {

  private selectedService: string = "";

  private mapInstance: google.maps.Map;

  private serviceFinder: boolean = false;

  private userMarker: google.maps.Marker;

  private serviceProviders: Array<Date> = [];

  private loading: boolean = true;

  private appointmentSelector: boolean = false;

  private dates : Array<Object> = [];

  private request;

  private days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  private services:Array<Object> = [
    {
      name: "Painter",
      img_src: "../../../assets/painter.svg",
    },
    {
      name: "Electrician",
      img_src: "../../../assets/electrician.svg",
    },
    {
      name: "Plumber",
      img_src: "../../../assets/plumber.svg",
    },
    {
      name: "Carpenter",
      img_src: "../../../assets/carpenter.svg",
    }
  ];

  initiateServiceFinder(service){
    console.log(`Start Time = ${Date.now()}`);
    console.log("Starting Process...");

    this.selectedService = service;
    this.serviceFinder = true;
    this.loading = true;

    let pincode,zone,lat,lng;

    if(window.localStorage.isLoggedIn){
      pincode = window.localStorage.getItem("pincode");
      zone = window.localStorage.getItem("zone");
      lat = window.localStorage.getItem("lat");
      lng = window.localStorage.getItem("lng");
      console.log("Variables set to send GET request");
    } else if(window.sessionStorage.isLoggedIn){
      pincode = window.sessionStorage.getItem("pincode");
      zone = window.sessionStorage.getItem("zone");
      lat = window.sessionStorage.getItem("lat");
      lng = window.sessionStorage.getItem("lng");
      console.log("Variables set to send GET request");
    } else {
      console.log("Error!");
      return;
    }

    const getURL = `http://localhost:5000/api/servicegetter?serviceType=${service}&pincode=${pincode}&zone=${zone}&lat=${lat}&lng=${lng}`;

    console.log("Sending GET Request to Server");

    fetch(getURL,{
      method: "GET"
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{
      console.log(arg);
      console.log("Server Responded with response");
      if(arg.success){
        console.log("Server Delivered data succesfully");
        const origin = new google.maps.LatLng(lat,lng);
        let destinations = [];

      for(let sp of arg.payload){
        destinations.push(new google.maps.LatLng(sp.lat,sp.lng));
      }

      const distanceService = new google.maps.DistanceMatrixService();
      
      console.log("Sending Latitude and Longitude array to Google Distance Matrix API ");
      distanceService.getDistanceMatrix({
        origins: [origin],
        destinations: destinations,
        travelMode: google.maps.TravelMode.WALKING
      },(response, status)=>{
        if(status=="OK"){
          console.log("Response Received from Distance Matrix API");
          const origins = response.originAddresses;
          // const destinations = response.destinationAddresses;
          console.log("Formatting data to extract required distances from response");
          for( let i=0; i<origins.length;i++){
            let results = response.rows[i].elements;
            for(let j=0;j<results.length;j++){
              let element = results[j];
              let distance = element.distance.value;
              arg.payload[j].distance = distance;
            }
          }

          this.loading = false;
      // Array Sorted on the basis of distance.
       arg.payload.sort(function(a,b){return a.distance-b.distance});

       this.serviceProviders = arg.payload;

      // console.log(arg.payload);

        console.log("adding markers to map");
       for(let i=0;i<this.serviceProviders.length;i++){
         this.serviceProviders[i].marker = this.mapService.addMarker(this.mapInstance,new google.maps.LatLng(this.serviceProviders[i].lat,this.serviceProviders[i].lng),"../../../assets/service_marker.png");
        this.mapService.animateMarker(this.serviceProviders[i].marker);
        }
        console.log(`End Time = ${Date.now()}`);
        } else {
          console.log(status);
          this.serviceProviders = arg.payload;


       for(let i=0;i<this.serviceProviders.length;i++){
         this.serviceProviders[i].marker = this.mapService.addMarker(this.mapInstance,new google.maps.LatLng(this.serviceProviders[i].lat,this.serviceProviders[i].lng),"../../../assets/service_marker.png");
        this.mapService.animateMarker(this.serviceProviders[i].marker);
        }

        console.log(Date.now());


        }
      });
      } else {
        this._snackbar.open("No Service Providers found in your area. Try Later.","Ok", {duration: 2000});
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Server Error. Try Later", "Ok", {duration: 2000});
    })
  }

  endServiceFinder(){
    this.selectedService = "";
    this.serviceFinder = false;
    this.loading = true;

    for(let sp of this.serviceProviders){
      this.mapService.removeMarker(sp.marker);
    }
  }

  constructor( private mapService: MainMapService, private _snackbar: MatSnackBar) { }

  ngOnInit() {

    let userLocation = {
      lat : 0,
      lng: 0
    };

    if(window.localStorage.isLoggedIn){
      userLocation.lat = Number(window.localStorage.lat);
      userLocation.lng = Number(window.localStorage.lng);
    } else {
      userLocation.lat = Number(window.sessionStorage.lat);
      userLocation.lng = Number(window.sessionStorage.lng);
    }

    if(window.innerWidth>767){
      this.mapInstance = this.mapService.mapInit(document.querySelector(".map-container"),userLocation);
      this.userMarker = this.mapService.addMarker(this.mapInstance,userLocation,"../../assets/marker.png");
    }

  }

  showAppointmentWindow(sp){

    console.log(sp);

    this.dates.length = 0;

    this.request = {
      spID : sp.id,
      nameOfSP : sp.name
    }

    if(window.localStorage.isLoggedIn){
      this.request.consID = window.localStorage.id;
    } else {
      this.request.consID = window.sessionStorage.id;
    }

    let date = new Date();
    
    for(let i=0;i<7;i++){
      this.dates.push(new Date(date.getTime()+(1000*60*60*24)*i));
    }
    
    this.appointmentSelector = true;
  }

  scheduleAppointment(date){
    
    this.request.dateScheduled = date; 
    this.appointmentSelector = false;

    fetch("http://localhost:5000/api/addrequest",{
      method: "POST",
      body: JSON.stringify(this.request),
      headers: {
        "Content-type": "application/json"
      }
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{
      if(arg.success){
        this._snackbar.open("Appointment Sent! Check History for more information","",{duration: 2000});
      } else {

        if(arg.remarks){
          this._snackbar.open(arg.remarks,"Ok",{duration: 2000});
        } else {
          this._snackbar.open("Unknown Error Occurred", "Ok", {duration: 2000});
        }
      }

      this.dates = [];

    }).catch((err)=>{
      console.log(err);
      this.dates = [];
      this._snackbar.open("Network Error Encountered.", "Ok", {duration: 2000});
    });
  }
}
