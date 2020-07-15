import { Component, OnInit } from '@angular/core';
import { SsconnectorService } from 'src/app/ssconnector.service';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'app-grocery',
  templateUrl: './grocery.component.html',
  styleUrls: ['./grocery.component.scss']
})
export class GroceryComponent implements OnInit {

  constructor(private socketServer: SsconnectorService, private _snackbar: MatSnackBar) {

  }


  ngOnInit() {

    this.socketServer.messages.subscribe(msg=>{
      console.log(msg);
      if(msg.status=="CONNECT"){
        if(msg.success){
          this._snackbar.open("Socket Server Connected.","OK",{duration: 2000});
        }else{
          this.socketServer.connectToServer({userID: window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id});
        }
      }
    });


  }

  unselect = "#0060FF";
  select = "#00296E";

  showElement(arg){
    console.log('mein chala bro');
    console.log(arg);
    
    if(arg.path[0].classList[0]=="create"||arg.path[1].classList[0]=="create"||arg.path[2].classList[0]=="create"){
      document.querySelector(".create").style.backgroundColor = this.select;
      document.querySelector(".place").style.backgroundColor = this.unselect;
      document.querySelector(".history").style.backgroundColor = this.unselect;

      document.querySelector("app-place-order").style.display = "none";
      document.querySelector("app-history-orders").style.display = "none";
      document.querySelector("app-create-list").style.display = "block";

    } else if(arg.path[0].classList[0]=="place"||arg.path[1].classList[0]=="place"||arg.path[2].classList[0]=="place"){
      document.querySelector(".create").style.backgroundColor = this.unselect;
      document.querySelector(".place").style.backgroundColor = this.select;
      document.querySelector(".history").style.backgroundColor = this.unselect;

      document.querySelector("app-create-list").style.display = "none";
      document.querySelector("app-place-order").style.display = "block";
      document.querySelector("app-history-orders").style.display = "none";

    } else if(arg.path[0].classList[0]=="history"||arg.path[1].classList[0]=="history"||arg.path[2].classList[0]=="history"){
      document.querySelector(".create").style.backgroundColor = this.unselect;
      document.querySelector(".place").style.backgroundColor = this.unselect;
      document.querySelector(".history").style.backgroundColor = this.select;

      document.querySelector("app-create-list").style.display = "none";
      document.querySelector("app-place-order").style.display = "none";
      document.querySelector("app-history-orders").style.display = "block";
    }
  }
}