import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SsconnectorService } from '../ssconnector.service';


@Component({
  selector: 'app-grocerydashboard',
  templateUrl: './grocerydashboard.component.html',
  styleUrls: ['./grocerydashboard.component.scss']
})
export class GrocerydashboardComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar, private socketServer: SsconnectorService) { }

  ngOnInit() {
    this.shopName = window.localStorage.isLoggedIn?window.localStorage.shopName:window.sessionStorage.shopName;
    this.getOrderNumbers();
    this.socketServer.messages.subscribe(msg=>{
      if(msg.status=="CONNECT"){
        if(msg.success){
          this._snackbar.open("Socket Server Connected.","OK",{duration: 2000});
        }else{
          this.socketServer.connectToServer({userID: window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id});
        }
      }else {
        this.getOrderNumbers();
      }
    });
  }


  categorySelected:boolean = false;
  selectedCategory: string;
  shopName: string;
  activeOrders: number;
  pendingOrders: number;

  previouslySelected:boolean = null;


  getOrderNumbers(){
    fetch(`http://localhost:5000/api/requestnumbers?spid=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id}`,{method: "GET"}).then((response)=>{return response.json()}).then((arg)=>{
      if(arg.success){
        this.activeOrders = arg.active;
        this.pendingOrders = arg.pending;
      }else{
        this._snackbar.open("Error Fetching Current Request Numbers!","OK",{duration: 2000});
      }
    })
  }



  selectToDisplay(evt){
    let elementSelected = null;

    if(evt.target.tagName=='DIV'){
      elementSelected = evt.target;
    } else {
      elementSelected = evt.path[1];
    }

    let elemText = elementSelected.children[0].innerText;

    this.selectedCategory = elemText;
  
    if(elemText=="Active Orders"){
      document.querySelector("app-active-orders").style.display = "block";
      document.querySelector("app-pending-orders").style.display = "none";
      document.querySelector("app-history").style.display = "none";
    } else if(elemText=="Pending Orders"){
      document.querySelector("app-active-orders").style.display = "none";
      document.querySelector("app-pending-orders").style.display = "block";
      document.querySelector("app-history").style.display = "none";
    } else {
      document.querySelector("app-active-orders").style.display = "none";
      document.querySelector("app-pending-orders").style.display = "none";
      document.querySelector("app-history").style.display = "block";
    }

    if(window.innerWidth<1200){
      document.querySelector(".back").style.display = "inline-block";
      this.categorySelected = true;
    }

    if(this.previouslySelected==null){
      elementSelected.classList.add("selected");
      this.previouslySelected = elementSelected;
    } else {
      this.previouslySelected.classList.remove("selected");
      elementSelected.classList.add("selected");
      this.previouslySelected = elementSelected;
    }

  }

  backToCategorySelection(){
   this.categorySelected = false;
   document.querySelector(".back").style.display = "none";
    document.querySelector("app-active-orders").style.display = "none";
    document.querySelector("app-pending-orders").style.display = "none";
    document.querySelector("app-history").style.display = "none";
  }

  

}
