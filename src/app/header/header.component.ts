import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router) { }

  private isLoggedIn: boolean = false;
  private name: string = "Logged in user";
  private firstTime: boolean = true; 


  conditionalRouting(){
    console.log("conditional routing started");
    if((window.localStorage.isLoggedIn&&window.localStorage.name!="")){
      if(window.localStorage.identity=="Consumer"){
        this.router.navigateByUrl('dashboard');
      } else if(window.localStorage.identity=="Service_Provider"&&window.localStorage.service=="Grocery Shop"){
        this.router.navigateByUrl('grocerydashboard');
      } else {
        this.router.navigateByUrl('spdashboard');
      }
        
    } else if(window.sessionStorage.isLoggedIn&&window.sessionStorage.name!=""){
      if(window.sessionStorage.identity=="Consumer"){
        this.router.navigateByUrl('dashboard');
      } else if(window.sessionStorage.identity=="Service_Provider"&&window.sessionStorage.service=="Grocery Shop"){
        this.router.navigateByUrl('grocerydashboard');
      }else{
        this.router.navigateByUrl('spdashboard');
      }
    }
    else {
      this.router.navigateByUrl('');
    }
  }
  
  
  

  ngOnInit() {
    // Import Header component and change its values in auth service

      

      this.router.events.subscribe((val)=>{
        if(val instanceof NavigationEnd){
          if(window.localStorage.isLoggedIn&&window.localStorage.name!=""){
            this.isLoggedIn = true;
            this.name = (window.localStorage.name.split(" "))[0];
          } else if(window.sessionStorage.isLoggedIn&&window.sessionStorage.name!=""){
            this.isLoggedIn = true;
            this.name = (window.sessionStorage.name.split(" "))[0];
          } else {
            this.isLoggedIn = false;
          }
        }
      });


  }

}
