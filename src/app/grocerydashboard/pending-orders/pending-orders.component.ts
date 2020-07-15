import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SsconnectorService } from 'src/app/ssconnector.service';


@Component({
  selector: 'app-pending-orders',
  templateUrl: './pending-orders.component.html',
  styleUrls: ['./pending-orders.component.scss']
})
export class PendingOrdersComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar, private socketServer: SsconnectorService) { }

  ngOnInit() {

    this.fetchPendingOrders();
    this.socketServer.messages.subscribe(msg=>{
      if(msg.status=="DELIVER"){
        if(msg.success){
          this._snackbar.open("GROCERY DELIVERED!","OK",{duration: 2000});
        } else{
          this._snackbar.open("Error in Contacting Database","OK",{duration: 2000});
        }
        this.fetchPendingOrders();
      }else if(msg.status=="ACCEPT"){
        this.fetchPendingOrders();
      }
    });


  }

  expression: boolean = true;
  emptyResponse:boolean = true;
  
  dateObj = new Date();

  requestArray = [];

  previouslySelected = null;

  selectedList;

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

    console.log(document.querySelectorAll(".details-container"));

    document.querySelectorAll(".details-container")[1].style.display = "block";

    presentElement.classList.add("selected");

    console.log(this.selectedList);

    if((window.innerWidth<=1400&&window.innerWidth>=1200)||(window.innerWidth<768)){
      document.querySelectorAll(".list-container")[1].style.display = "none";
      document.querySelectorAll(".details-container")[1].style.display = "block";
    }
  }

  backToListSelect(evt){
    document.querySelectorAll(".list-container")[1].style.display = "block";
    document.querySelectorAll(".details-container")[1].style.display = "none";

  }

  resetPrice(){
    this.expression = false;
    var allPriceInputs = document.querySelectorAll(".item-price");
    for( var i=0;i<this.selectedList.listItems.length;i++){
      this.selectedList.individualCost[i] = 0;
      allPriceInputs[i].value = 0;
    }
    this.expression = true;
    this.selectedList.totalCost = 0;
  }

 
  changePrice(evt,index){
    console.log(evt.target.value);
    this.selectedList.individualCost[index] = Number(evt.target.value);
  }

  total(){
    let totalPrice = 0;
    for( var i=0;i<this.selectedList.listItems.length;i++){
      totalPrice+=this.selectedList.individualCost[i];
    }

    this.selectedList.totalCost = totalPrice;
    
  }

  sendForDelivery(){
// Enter checks before delivery
    let del = true;

    if(this.selectedList.totalCost==0){
      this._snackbar.open("Press Total and then Deliver","Ok",{duration: 2000});
      del = false;
    }else{

      for(let item of this.selectedList.individualCost){
        if(item==0){
          del = false;
        }
      }
      if(!del){
        this._snackbar.open("Please Fill Price for all","Ok",{duration: 2000});
      }
      
    }

if(del){
  this.socketServer.sendToServer({
    ID: window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id,
    otherID: this.selectedList.consumerID,
    function: "DELIVER",
    data: {
      reqID: this.selectedList.requestID,
      totalCost: this.selectedList.totalCost,
      individualCost: this.selectedList.individualCost
    }
  });
}
    

  }


  fetchPendingOrders(){
    fetch(`http://localhost:5000/api/pendingfetcher?spid=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id}`,{method: "GET"}).then((response)=>{return response.json();}).then((arg)=>{
      if(arg.success){
        console.log(arg);

        if(arg.payload!=null){
          this.requestArray = arg.payload;
          this.selectedList = this.requestArray[0];
          this.emptyResponse = false;
        }else{
          this.selectedList = null;
          this.emptyResponse = true;
        }
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Server Error.","OK",{duration: 2000});
    });
  }

}
