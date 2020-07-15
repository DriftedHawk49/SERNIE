import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-all-lists',
  templateUrl: './all-lists.component.html',
  styleUrls: ['./all-lists.component.scss']
})
export class AllListsComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar) { }

  previouslySelectedItem = null;
  loaded:boolean = false;
  listArray = [];
  listToDisplay = null;

  
  backToShowList(evt){
    document.querySelector(".back").style.display = "block";
    document.querySelector(".mini-back").style.display = "none";

    if(window.innerWidth>768){
      document.querySelector(".listDisplayContainer").style.display = "block";
    } else {
      document.querySelector(".listSelector").style.display = "block";
    }
    document.querySelector(".listEdit").style.display = "none";
  }

  showToEditList(evt){

    if(window.innerWidth>768){
      document.querySelector(".listDisplayContainer").style.display = "none";
    }
    document.querySelector(".back").style.display = "none";
    document.querySelector(".mini-back").style.display = "block";
    document.querySelector(".listEdit").style.display = "block";

  }

  fetchAllLists(callback = null){
    fetch(`http://localhost:5000/api/getlists?id=${window.localStorage.id}`,{
      method: "GET"
    }).then((response)=>{
      return response.json();
    }).then((result)=>{
      
      if(result.success){
        this.listArray = result.payload;
        this.loaded = true;
        for(var i=0;i<this.listArray.length;i=i+1){
          this.listArray[i].dateOfCreation = (new Date(this.listArray[i].dateOfCreation));
        }
        
        if(callback!=null){
          callback();
        }
  
      } else {
        this._snackbar.open("Error fetching Results. Try Again Later.","OK",{duration: 2000 })
      }
  
    });
      
  }

  listSelectorClick(evt,list,index){
    let myElement;
    this.listToDisplay = list;
    this.listToDisplay.index = index;

    // Selecting the clicked Element
    if(evt.path[0].tagName=="DIV"){
      myElement = evt.path[0];
    } else if(evt.path[0].tagName=="SPAN"){
      myElement = evt.path[1];
    }

    // Applying class to that item to change its CSS.
    if(this.previouslySelectedItem==null){
      myElement.classList.add("currentlySelected");
      this.previouslySelectedItem = myElement;
    } else {
      this.previouslySelectedItem.classList.remove("currentlySelected");
      myElement.classList.add("currentlySelected");
      this.previouslySelectedItem = myElement;
    }

    if(window.innerWidth<768){
      document.querySelector(".listSelector").style.display = "none";
      this.showToEditList(null);
    }

    
  }

  enterSimulator(){
      window.addEventListener("keypress",this.addEnterEvent);
  }

  enterDeSimulator(){
    window.removeEventListener("keypress",this.addEnterEvent);
  }

  addEnterEvent(evt){
    if(evt.which==13){
      evt.preventDefault();
      document.getElementById("addListbtn").click();
    }
    
  }

  addToList(){
    if(this.listToDisplay.editable){
    var item:string = document.querySelector(".newItem").value;
    var reg = new RegExp("[0-9]");
    if(item!=""&&item.length>=5&&reg.test(item)){
      this.listToDisplay.listItems.push(item);
      document.querySelector(".newItem").value = "";
    } else {
      this._snackbar.open("Enter Quantity in Numbers","OK",{duration: 2000});
    }}
    else{
      this._snackbar.open("List Already in Use. Cannot Edit.", "OK",{duration: 2000});
    }

  }

  removeFromList(index){
    this.listToDisplay.listItems.splice(index,1);
  }

  editIndividualItems(){
    this.listToDisplay.listName = document.querySelector(".ListNameEdit").value;
    const elementList = document.querySelectorAll(".list-edit-item input");
    for(let index=0;index<this.listToDisplay.listItems.length;index=index+1){
      this.listToDisplay.listItems[index] = elementList[index].value;
    }
    
  }

  reverseChangesToDisplayList(){
    this.fetchAllLists();   
    setTimeout(()=>{
      const listItem = document.querySelectorAll(".listItem");
      for(let i=0;i<this.listArray.length;i=i+1){
        if(this.listToDisplay._id == this.listArray[i]._id){
          listItem[i].click();
        }
      }
      },100);

  }

  saveList(){
    if(this.listToDisplay.editable){
    this.editIndividualItems();
    var payload = {
      _id: this.listToDisplay._id,
      listName: this.listToDisplay.listName,
      listItems: this.listToDisplay.listItems
    }
    fetch('http://localhost:5000/api/editList',{
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-type': 'application/json'
      }
    }).then((arg)=>{
      return arg.json();
    }).then((result)=>{
      if(result.success){
        this._snackbar.open('List Edit Saved!',"OK",{duration: 2000});
        
      }else{
        this._snackbar.open('Server Error. Please Try again later',"OK",{duration: 2000});
        this.reverseChangesToDisplayList();
        this.loaded = false;
        setTimeout(()=>{
          this.loaded = true;
        },50);
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open('Server Unreachable. Try Again Later', "OK", {duration: 4000});
      this.reverseChangesToDisplayList();
      
    });
  }else {
    this._snackbar.open("List Already in Use! Cannot Edit!", "Ok", {duration: 2000});
  }}

  deleteList(){
    fetch(`http://localhost:5000/api/deletelist?_id=${this.listToDisplay._id}`,{
      method: 'GET'
    }).then((res)=>{
      return res.json();
    }).then((arg)=>{
      if(arg.success){
        this._snackbar.open("List Removed!","OK",{duration: 2000});
      } else {
        this._snackbar.open("Server Error. Try again later","OK",{duration: 2000});
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Server Not Responding! Try Again Later","OK",{duration: 2000});
    });

    if(this.listArray.length>1){
      this.listArray.splice(this.listToDisplay.index,1);
      this.listToDisplay = null;
    }else{
      this.listArray = [];
      this.loaded = false;
    }

  }

  copyToBuildNew(){
    var copyList = {
      listName: this.listToDisplay.listName+" Copy",
      listItems: this.listToDisplay.listItems,
      dateOfCreation: new Date(),
      creator: window.localStorage.id?window.localStorage.id:window.sessionStorage.id
    }
    fetch("http://localhost:5000/api/addlist",{
          method: "POST",
          body: JSON.stringify(copyList),
          headers: {
            "Content-type": "application/json"
          }
        }).then((response)=>{
          return response.json();
        }).then((arg)=>{
          if(arg.success){
            this._snackbar.open("Copy List Created!","OK",{duration: 2000});
            this.fetchAllLists();
          }
        }).catch((err)=>{
          console.log(err);
        });
  }
                    
  ngOnInit() {
    this.fetchAllLists();
  }

}
