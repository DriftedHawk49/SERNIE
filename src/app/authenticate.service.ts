import { Injectable} from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';




@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  url: string = "http://localhost:5000/api/auth";
  

   async checkPresence(){
    console.log("Auth Service Triggered");

    if(window.localStorage.isLoggedIn){
      return await fetch(this.url,{
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({id: window.localStorage.id, customHash: window.localStorage.customHash, identity: window.localStorage.identity})
      }).then((response)=>{
        return response.json();
      }).then((arg)=>{
        if(arg.authenticated){
          console.log("authorization complete");
          return true;
        } else {
          window.localStorage.clear();
        window.sessionStorage.clear();
        this.router.navigate(['/login']);
        this._snackbar.open("Please Login to Continue", "Ok");
        return false;
        }
      }).catch((err)=>{
        console.log(err);
        window.localStorage.clear();
        window.sessionStorage.clear();
        this.router.navigate(['/login']);
        this._snackbar.open("Please Login to Continue", "Ok");
        return false;
      });
    } else if(window.sessionStorage.isLoggedIn){
      console.log(window.sessionStorage.identity);
      return await fetch(this.url,{
        method: 'POST',
        headers: {
          'Content-Type': "application/json"
        },
        body: JSON.stringify({id: window.sessionStorage.id, customHash: window.sessionStorage.customHash, identity: window.sessionStorage.identity})
      }).then((response)=>{
        return response.json();
      }).then((arg)=>{
        if(arg.authenticated){
          
          console.log("authorization complete");
          return true;
        }
        else{
          window.localStorage.clear();
        window.sessionStorage.clear();
        this.router.navigate(['/login']);
        this._snackbar.open("Please Login to Continue", "Ok");
        return false;
        }
      }).catch((err)=>{
        console.log(err);
        window.localStorage.clear();
        window.sessionStorage.clear();
        this.router.navigate(['/login']);
        this._snackbar.open("Please Login to Continue", "Ok");
        return false;
      });
    }
    else {
      window.localStorage.clear();
      window.sessionStorage.clear();
      this.router.navigate(['/login']);
      this._snackbar.open("Please Login to Continue", "Ok");
      return false;
    }
  }

  basicAuth(){
    //  Add basic authentication logic where if logged in, all routes will be diverted to dashboard
    console.log("starting basic auth");
    if((window.localStorage.isLoggedIn&&window.localStorage.identity=="Consumer")||(window.sessionStorage.isLoggedIn&&window.sessionStorage.identity=="Consumer")){
      this.router.navigateByUrl("dashboard");
      return false;
    } else if((window.localStorage.isLoggedIn&&window.localStorage.identity=="Service_Provider")||(window.sessionStorage.isLoggedIn&&window.sessionStorage.identity=="Service_Provider")){
      // Enter routing for service provider dashboard
      if(window.localStorage.service=="Grocery Shop"||window.sessionStorage.service=="Grocery Shop"){
        this.router.navigate(["grocerydashboard"]);
      }else{
        this.router.navigate(["spdashboard"]);
      }
      return false;
    } else {
      return true;
    }
  }

  constructor(private _snackbar: MatSnackBar, private router: Router) { }
}
