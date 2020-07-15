import { Component, OnInit } from '@angular/core';
import { SpecificShopSelectorService } from 'src/app/specific-shop-selector.service';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SsconnectorService } from 'src/app/ssconnector.service';


@Component({
  selector: 'app-place-order-window',
  templateUrl: './place-order-window.component.html',
  styleUrls: ['./place-order-window.component.scss']
})
export class PlaceOrderWindowComponent implements OnInit {

  constructor(private socketServer:SsconnectorService,private dataSettingService: SpecificShopSelectorService, private router: Router, private _snackbar: MatSnackBar) { }

  shopDetails = {};
  userLists = [];
  previouslySelectedItem = {};
  selectedList ;
  isListSelected:boolean = false;
  isPictureSelected:boolean = false;
  isListSelectorSelected:boolean = true;


  fetchUserLists(){
    let userID;
    if(window.localStorage.isLoggedIn){
      userID = window.localStorage.id;
    } else if(window.sessionStorage.isLoggedIn){
      userID = window.sessionStorage.id;
    }

    fetch(`http://localhost:5000/api/getlists?id=${userID}`,{method:"GET"}).then((response)=>{return response.json()}).then((arg)=>{
      if(arg.success){
        this.userLists = arg.payload;
        console.log(this.userLists);
      } else {
        this._snackbar.open("Server Error. Please Try Again Later.","OK",{duration: 2000});
      }
    })
  }

selectListForOrder(evt,list){
  this.selectedList = list;
  this.isListSelected = true;
  this.isPictureSelected = false;

  if(window.innerWidth<1250){
    this.isListSelectorSelected = false;
  }
}

resetEverything(){
  this.isListSelected = false;
  this.isPictureSelected = false;
  this.selectedList = null;
  this.isListSelectorSelected = true;
}

// selectPictureForOrder(evt){
//   const files = evt.target.files;
//   this.isListSelected = false;
//   this.isPictureSelected = true;
//   if(window.innerWidth<1250){
//     this.isListSelectorSelected = false;
//   }
//   console.log(this.isListSelected);
//   let f = files[0];
//   let reader = new FileReader();

//   reader.onload = ((theFile)=>{
//     return function(e) {
//       document.querySelector(".list-photo").src = e.target.result;
//     }
//   })(f);

//   reader.readAsDataURL(f);
// }


// for place order button , first build API Endpoint


placeOrder(){

  this.socketServer.sendToServer({
    ID: window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id,
    otherID: this.dataSettingService.data.id,
    function: "PLACE",
    data: {
      listID: this.selectedList._id,
      lengthOfList: this.selectedList.listItems.length
    }
  });


}

  ngOnInit() {

    if(this.dataSettingService.data.id==null){
      this.router.navigate(['/grocery']);
    } else {
      this.shopDetails = this.dataSettingService.data;
      this.fetchUserLists();
    }

    this.socketServer.messages.subscribe(msg=>{
      if(msg.status=="PLACE"){
        if(msg.success){
          this._snackbar.open("Order Placed!","OK",{duration: 2000});
        } else{
          this._snackbar.open("Error in Contacting Database","OK",{duration: 2000});
        }
        this.router.navigate(["grocery"]);
      }
    })

    


  }

}
