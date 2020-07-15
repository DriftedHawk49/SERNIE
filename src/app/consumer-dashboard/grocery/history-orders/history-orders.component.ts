import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SsconnectorService } from 'src/app/ssconnector.service';

@Component({
  selector: 'app-history-orders',
  templateUrl: './history-orders.component.html',
  styleUrls: ['./history-orders.component.scss']
})
export class HistoryOrdersComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar, private socketServer: SsconnectorService) { }

  allRequests = [];
  loading:boolean =  true;
  emptyRequest: boolean = false;


  trackFn(index,item){
    return item?item.requestID:null;
  }

  delivered(index){
    this.allRequests[index].delivered = true;
    var reqId = this.allRequests[index].requestID;
    fetch(`http://localhost:5000/api/deliveryconfirmation?reqid=${reqId}`,{method: "GET"}).then((response)=>{return response.json();}).then((arg)=>{
      
      console.log(arg);
    if(arg.success){
        this._snackbar.open("Response Recorded!","OK",{duration: 2000});
      } else {
        this._snackbar.open("Server Error. Please Try again later.","OK",{duration: 2000});
      }
    });
  }


  getAllRequests(){

    let creator = window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id;
    fetch(`http://localhost:5000/api/getgroceryrequests?creator=${creator}`,{method: "GET"}).then((response)=>{return response.json()}).then((arg)=>{


    if(arg.success){

      if(arg.payload==null){

        this.loading = false;
        this.emptyRequest = true;

      }else{

        for(let i=0;i<arg.payload.length;i++){
          arg.payload[i].dateOfGeneration = new Date(arg.payload[i].dateOfGeneration);
        }  
        this.allRequests = arg.payload;
        this.loading = false;

      }

      

    } else {

      this._snackbar.open("Server Problem. Please Try again Later","OK",{duration: 2000});
      
    }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Server Problem. Please Try again Later","OK",{duration: 2000});
    })
  }



  ngOnInit() {
  this.getAllRequests();
  this.socketServer.messages.subscribe(msg=>{
  if(msg.status=="DELIVER"||msg.status=="ACCEPT"||msg.status=="REJECT"){
    console.log("SERVICE PROVIDER DID SOMETHING!");
    console.log(msg.status);
    this.getAllRequests();
  }
  });

  }


  dropdown(arg){
    if(arg.path[1].style.maxHeight=="1000px"){
      arg.path[1].style.maxHeight = "40px";
      arg.srcElement.style.transform = "rotateZ(0deg)";
    } else {
      arg.path[1].style.maxHeight = "1000px";
      arg.path[1].style.height = "auto";
      arg.srcElement.style.transform = "rotateZ(180deg)";
    }
  }

}
