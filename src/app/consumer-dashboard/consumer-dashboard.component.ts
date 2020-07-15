/// <reference types="@types/googlemaps" />

import { Component, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-consumer-dashboard',
  templateUrl: './consumer-dashboard.component.html',
  styleUrls: ['./consumer-dashboard.component.scss']
})
export class ConsumerDashboardComponent implements OnInit {

  constructor() { }

  

  switchColors(arg){
    const clickedItem = arg.currentTarget;
    
    if((clickedItem.className.split(" "))[0]=="service"){
      clickedItem.style.backgroundColor = "#0060FF";
      document.querySelector(".history").style.backgroundColor = "#00B5FF";
    }
    else{
      clickedItem.style.backgroundColor = "#0060FF";
      document.querySelector(".service").style.backgroundColor = "#00B5FF";
    }
  }


  ngOnInit() {

  

  }

}
