import { Component, OnInit, Input, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SsconnectorService } from 'src/app/ssconnector.service';


@Component({
  selector: 'app-active-orders',
  templateUrl: './active-orders.component.html',
  styleUrls: ['./active-orders.component.scss']
})
export class ActiveOrdersComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar, private socketServer: SsconnectorService) { }

  ngOnInit() {
    this.fetchActiveOrders();

    this.socketServer.messages.subscribe(msg=>{
      console.log(msg);
      if(msg.status=="ACCEPT"){
        if(msg.success){
          this._snackbar.open("Request Accepted!","OK",{duration: 2000});
          this.fetchActiveOrders();
        } else{
          this._snackbar.open("Error in Contacting Database","OK",{duration: 2000});
        }
      }else if(msg.status=="PLACE"){
        this._snackbar.open("New Requests!","Ok",{duration: 2000});
        this.fetchActiveOrders();
      }else if(msg.status=="REJECT"){
        if(msg.success){
          this._snackbar.open("Request Rejected!","OK",{duration: 2000});
          this.fetchActiveOrders();
        } else{
          this._snackbar.open("Error in Contacting Database","OK",{duration: 2000});
        }
      }
    });


  }
  emptyResponse = true;
  selectedList;
  requestArray = [];
  previouslySelected = null;

  fetchActiveOrders(){
    fetch(`http://localhost:5000/api/activefetcher?spid=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id}`,{method: "GET"}).then((response)=>{return response.json();}).then((arg)=>{
      if(arg.success){
        if(arg.payload==null){
          this.emptyResponse = true;
        }else{
          this.emptyResponse = false;
          this.requestArray = arg.payload;
          this.selectedList = this.requestArray[0];
          console.log(this.requestArray);
        }
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Couldn't fetch result. Server Unreachable.","OK",{duration: 2000});
    })
  }

  acceptOrders(){
    this.socketServer.sendToServer({
      ID: window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id,
      otherID: this.selectedList.consumerID,
      function: "ACCEPT",
      data: {
        reqID: this.selectedList.requestID
      }
    });

  }

  rejectOrders(){

    this.socketServer.sendToServer({
      ID: window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id,
      otherID: this.selectedList.consumerID,
      function: "REJECT",
      data: {
        reqID: this.selectedList.requestID
      }
    });

  }

  setDisplay(evt,list){
    this.selectedList = list;
    let presentElement;

    if(evt.target.tagName=="DIV"){
      presentElement = evt.target;
    } else {
      presentElement = evt.path[1];
    }


    if(this.previouslySelected==null){
      this.previouslySelected = presentElement;
    } else {
      this.previouslySelected.classList.remove("selected");
      this.previouslySelected = presentElement;
    }
    document.querySelector(".details-container").style.display = "block";

    presentElement.classList.add("selected");


    if((window.innerWidth<=1400&&window.innerWidth>=1200)||(window.innerWidth<768)){
      document.querySelector(".list-container").style.display = "none";
      document.querySelector(".details-container").style.display = "block";
    }

  }

  backToListSelect(evt){

    document.querySelector(".list-container").style.display = "block";
    document.querySelector(".details-container").style.display = "none";

  }

}
