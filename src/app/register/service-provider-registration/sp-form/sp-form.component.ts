/// <reference types="@types/googlemaps" />

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { ServiceProvider } from './../../../sp.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatRippleModule } from '@angular/material/core';
import { Router } from '@angular/router';



@Component({
  selector: 'app-sp-form',
  templateUrl: './sp-form.component.html',
  styleUrls: ['./sp-form.component.scss']
})
export class SpFormComponent implements OnInit {

  private spForm: FormGroup;

  private map: google.maps.Map;

  private newSP: ServiceProvider;

  private shopAddressShow: boolean = false;

  private spPresence: boolean = false;

  private initialStep: boolean = false;
  
  private markers = [];

  private durationInMs  =  3000;

  private spRegistrationURL: string = "http://localhost:5000/api/spregister";

  private spPresenceURL: string = "http://localhost:5000/api/serviceProviderCheckPresence";

  private typesOfServices:string[] = [
    "Electrician",
    "Carpenter",
    "Painter",
    "Plumber",
    "Grocery Shop"
  ];

  private zones:string[] = [
    "New-Delhi",
    "North-West-Delhi",
    "North-Delhi",
    "West-Delhi",
    "South-West-Delhi",
    "South-Delhi",
    "South-East-Delhi",
    "Central-Delhi",
    "North-East-Delhi",
    "Shahdara",
    "East-Delhi"
  ];

  constructor(private fb:FormBuilder, private _snackBar: MatSnackBar, private router: Router) { }

  shopAddressToggle(evt){
    console.log(evt.value);
    if(evt.value=="Grocery Shop"){
      this.shopAddressShow = true;
    } else {
      this.shopAddressShow = false;
    }

  }

  passwordValidator(p1:String, p2: String){
    if(p1===p2){
      return true;
    } else return false;
  }

  // Function that makes a POST request to server for adding users to the database
  private addServiceProvider(sp: ServiceProvider){
    fetch(this.spRegistrationURL,{
      method:'POST',
      body: JSON.stringify(sp),
      headers: {
        'Content-Type': 'application/json'
      }
    }).then((response)=>{
       return response.json();
    }).then((arg)=>{
      if(arg.success){
        this._snackBar.open("Registration Successful !", "Ok",{
          duration: this.durationInMs,
        });
        this.router.navigateByUrl('/login');
      } else if(!arg.success){
        this._snackBar.open("Error Encountered. Try Again Later.", "Ok", {
          duration: this.durationInMs,
        });
      }
      
    }).catch(function(err){
      console.log(err);
    });
  }

// Function that makes GET request to the server to check whether the user exists or not.
  private presenceCheck(sp: ServiceProvider){
    var getURL = `?phone=${sp.phone}&email=${sp.email}`;
    fetch(this.spPresenceURL+getURL,{
      method: 'GET'
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{
      if(arg.phone||arg.email){
        this._snackBar.open("This Phone already Holds an account. Go to Login.", "Ok", {
          duration: this.durationInMs,
        });
      }
      else{
        this.initialStep = true;
         var mapInstance = this.mapInit();
         this.enableLocation(this,mapInstance);
      }
    }).catch((err)=>{
      console.log(err);
      this._snackBar.open("Cannot Contact server right now. Please Try again Later", "OK", {duration: this.durationInMs});
    });
  }
// Function to add the marker on the map. and adds it to the global marker array.
  private addMarker(self,map,pos){
    var marker = new google.maps.Marker({
      position: pos,
      map:map
    });
    self.markers[0]=marker;
  }
// Function to update the ui with the found out address.
  private showAddress(text){
    document.querySelector(".selectedAddress").innerText = text;
  }

// Function to initialise map on the page and define click event on the map for getting the details off the geocoder and display over the map
  private mapInit(){
    var mapProp = {
      center: new google.maps.LatLng(28.644800,77.216721),
      zoom: 11,
      disableDefaultUI: true
    };
    
    this.map = new google.maps.Map(document.querySelector(".mapElement"), mapProp);
    this.map.addListener('click',(arg)=>{
      if(this.markers.length!=0){
        this.markers[0].setMap(null);
      }
      this.locator(this.map,{lat: arg.latLng.lat(), lng: arg.latLng.lng()},this);
    });

    return this.map;
  }

// Function that accepts map, coordinates and global this pointer and 
  private locator(map,pos,self) {
          self.addMarker(self,map,pos);
          map.panTo(pos);
          map.setZoom(15);
          var geocoder = new google.maps.Geocoder;
          geocoder.geocode({'location': pos}, (results,status)=>{
            if(status=='OK'){
              self._snackBar.open("Located You !", "Ok", {
                duration: self.durationInMs,
              });
               self.showAddress("Is this You? : "+results[0].formatted_address);
            } else {
              self.showAddress("There was an error fetching your location");
              document.querySelector(".selectedAddress").style.color = "red";
            }
          });    
  }

// To handle errors while using HTML5 geolocation
  private locatorErrorHandler(self,err){
    switch(err.code) {
      case err.PERMISSION_DENIED:
        self._snackBar.open("You denied It! Mark it yourself then.", "Ok", {
          duration: self.durationInMs,
        });
        break;
      case err.POSITION_UNAVAILABLE:
        self._snackBar.open("No location device detected. Manually mark it.", "Ok", {
          duration: self.durationInMs,
        });
        break;
      case err.TIMEOUT:
        self._snackBar.open("You didn't accept in time!", "Ok", {
          duration: self.durationInMs,
        });
        break;
      case err.UNKNOWN_ERROR:
        self._snackBar.open("Sorry unknown error occurred.", "Ok", {
          duration: self.durationInMs,
        });
        break;
      }
    }

    // To enable HTML5 geolocation API and abstractly handle the data received.
  private enableLocation(self,mapInstance){
    if(window.navigator.geolocation){
      window.navigator.geolocation.getCurrentPosition((pos)=>{
        self.locator(mapInstance,{lat: pos.coords.latitude, lng: pos.coords.longitude},self);
      },(err)=>{
        self.locatorErrorHandler(self,err);
        }
      );
    }
  }

  ngOnInit() {

    this.spForm = this.fb.group({
      name: ['',[Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.max(9999999999), Validators.min(7000000000)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      rePassword: ['', [Validators.required, Validators.minLength(6)]],
      address: ['', [Validators.required, Validators.minLength(10)]],
      zone: ['', [Validators.required]],
      pincode: ['', [Validators.required, Validators.pattern(/(^[0-9]*$)/)]],
      service: ['', [Validators.required,]],
      shopAddress: [''],
      shopName: ['']
    });

  }

  get name(){
    return this.spForm.get("name");
  }

  get phone(){
    return this.spForm.get("phone");
  }

  get email(){
    return this.spForm.get("email");
  }

  get password(){
    return this.spForm.get("password");
  }

  get rePassword(){
    return this.spForm.get("rePassword");
  }

  get address(){
    return this.spForm.get("address");
  }

  get zone(){
    return this.spForm.get("zone");
  }

  get pincode(){
    return this.spForm.get("pincode");
  }

  get service(){
    return this.spForm.get("service");
  }

  get shopAddress(){
    return this.spForm.get("shopAddress")
  }

  get shopName(){
    return this.spForm.get("shopName");
  }

  async submitAction(){
    if(!this.initialStep){
      const formValue = this.spForm.value;
      this.newSP = new ServiceProvider;
    if(this.spForm.invalid){
      this._snackBar.open("Please Review the fields!", "Ok", {
        duration: this.durationInMs,
      });
    }
    else if(this.passwordValidator(formValue.password, formValue.rePassword)){
      this.newSP.name = formValue.name;
      this.newSP.email = formValue.email;
      this.newSP.password = formValue.password;
      this.newSP.address = formValue.address;
      this.newSP.zone = formValue.zone;
      this.newSP.pincode = formValue.pincode;
      this.newSP.phone = formValue.phone;
      this.newSP.service = formValue.service;
      if(this.shopAddressShow){
        this.newSP.shopAddress = formValue.shopAddress;
        this.newSP.shopName = formValue.shopName;
      }
      this.presenceCheck(this.newSP);


    }
    else{
      // Password didn't Match Brother!
      this._snackBar.open("Password didn't match! Retry", "Ok", {
        duration: this.durationInMs,
      });
    }
    }
    else if(this.initialStep){
      if(this.markers[0].length!=0){
        var newLocation = {
          lat: this.markers[0].internalPosition.lat(),
          lng: this.markers[0].internalPosition.lng()
        }

        this.newSP.location = JSON.stringify(newLocation);
        this.addServiceProvider(this.newSP);
          
      } else {
        this._snackBar.open("Locate Yourself First.", "ok", {duration: this.durationInMs});
      }
      
    }
  }
}
