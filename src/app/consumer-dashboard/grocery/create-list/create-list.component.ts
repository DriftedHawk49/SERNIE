import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-create-list',
  templateUrl: './create-list.component.html',
  styleUrls: ['./create-list.component.scss']
})
export class CreateListComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar) { }

  ngOnInit() {
  }

  private newList = [];

  addNewItem(){
    var item:string = document.querySelector(".entry-field input").value;
    var reg = new RegExp("[0-9]");
    if(item!=""&&item.length>=5&&reg.test(item)){
      if(this.newList.length==0){
        document.querySelector(".dummyText").innerText = "";
      }
      this.newList.push(item);
      document.querySelector(".entry-field input").value = "";
    } else {
      this._snackbar.open("Enter Quantity in Numbers","OK",{duration: 2000});
    }
    
  }



  removeItem(index){
    if(this.newList.length==1){
      this.newList = [];
      if(this.newList.length==0){
        document.querySelector(".dummyText").innerHTML = "For Eg: \<br\>\<br\> Potato - 1KG\<br\>Red Chilli Kutti - 1Pkt";
      }
    } else {
    this.newList.splice(index,1);
    }
  }

  simulateEnterFunction(){
    document.addEventListener("keypress",this.enterKeySimulator)
  }

  removeSimulatorFunction(){
    document.removeEventListener("keypress",this.enterKeySimulator);
  }

  enterKeySimulator(evt,){
    if(evt.which==13){
      evt.preventDefault();
      document.getElementById('addItem').click();

    }
  }

  saveListToDatabase(){
    var listName = document.querySelector(".save-container input").value;
    console.log(listName);

    if(listName.length<5){
      this._snackbar.open("Enter Valid List Name (Length 5)", "OK", {duration: 2000});
    } else {
      if(this.newList.length == 0){
        this._snackbar.open("List Cannot Be Empty!", "OK", {duration: 2000});
      } else {

       

        var newList = {
          'listName': listName,
          'listItems': this.newList,
          'dateOfCreation': new Date(),
          'creator': window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id
        }

        fetch("http://localhost:5000/api/addlist",{
          method: "POST",
          body: JSON.stringify(newList),
          headers: {
            "Content-type": "application/json"
          }
        }).then((response)=>{
          return response.json();
        }).then((arg)=>{
          if(arg.success){
            this._snackbar.open("List Saved!","OK",{duration: 2000});
            this.newList = [];
            document.querySelector(".save-container input").value = "";
            document.querySelector(".dummyText").innerHTML = "For Eg: \<br\>\<br\> Potato - 1KG\<br\>Red Chilli Kutti - 1Pkt";
          }
        })

      }
    }
  
  }




}
