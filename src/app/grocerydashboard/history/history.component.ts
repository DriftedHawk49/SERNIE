import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SsconnectorService } from 'src/app/ssconnector.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar, private socketServer: SsconnectorService) { }

  

  dateObj = new Date();

  emptyResponse: Boolean = true;

  requestArray = [];

  previouslySelected = null;

  selectedList;

  selectList(evt,list){

    let presentElement = null;

    if(evt.target.tagName=="DIV"){
      presentElement = evt.target;
    } else if(evt.target.tagName=="SPAN"){
      presentElement = evt.path[1];
    }

      if(this.previouslySelected==null){
      presentElement.classList.add("selected");
      for(var child of presentElement.children){
        child.classList.add("selected-color");
      }
      this.previouslySelected = presentElement;

    } else {

      this.previouslySelected.classList.remove("selected");
      for(var child of this.previouslySelected.children){
        child.classList.remove("selected-color");
      }
      presentElement.classList.add("selected");
      for(var child of presentElement.children){
        child.classList.add("selected-color");
      }
      this.previouslySelected = presentElement;
    }
    document.querySelector(".history-display").style.display = "block";

    if(window.innerWidth<1900){
      document.querySelector(".history-list-container").style.display = "none";
    }

    this.selectedList = list;

    console.log(this.selectedList);
  }

  goBack(){
    document.querySelector(".history-list-container").style.display = "block";
    document.querySelector(".history-display").style.display = "none";

  }

  fetchRequests(){
    fetch(`http://localhost:5000/api/historyfetcher?spid=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id}`,{method: "GET"}).then((repsonse)=>{return repsonse.json()}).then((arg)=>{

    if(arg.success){

      if(arg.payload!=null){
        this.requestArray = arg.payload;

        for(let i=0;i<this.requestArray.length;i++){
          this.requestArray[i].dateOfGeneration = new Date(this.requestArray[i].dateOfGeneration);
        }

        this.selectedList = this.requestArray[0];
        this.emptyResponse = false;
      }
    }

    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Cannot Contact Server. Try Later");
    })


  }



  ngOnInit() {

    this.fetchRequests();

    this.socketServer.messages.subscribe(msg=>{
      if(msg.status=="DELIVER"){
        if(msg.success){
          this._snackbar.open("GROCERY DELIVERED!","OK",{duration: 2000});
        } else{
          this._snackbar.open("Error in Contacting Database","OK",{duration: 2000});
        }
        this.fetchRequests();
      }
    })

  }

 

}
