import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SsconnectorService } from '../ssconnector.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

  private name: string = "Jhon Doe";
  private email: string = "jhondoe@email.com";
  private number: number = 1234567890;
  private oldPassword: string;
  private newPassword: string;
  private newRePassword: string;

  constructor(private socketServer: SsconnectorService,private _snackbar: MatSnackBar, private router: Router) { }

  changeEmail(){
    if(/^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.email)){

      fetch('http://localhost:5000/api/changeemail',{
        method: 'POST',
        body: JSON.stringify({identity: window.localStorage.identity?window.localStorage.identity:window.sessionStorage.identity, id: window.localStorage.id?window.localStorage.id:window.sessionStorage.id, email: this.email, customHash: window.localStorage.customHash?window.localStorage.customHash:window.sessionStorage.customHash}),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response)=>{
        return response.json();
      }).then((arg)=>{
        if(arg.success){
          this.email = arg.email;
          console.log(arg);
          if(window.localStorage.isLoggedIn){
            window.localStorage.setItem("email",arg.email);
            window.localStorage.setItem("customHash",arg.customHash);
          } else if (window.sessionStorage.isLoggedIn){
            window.sessionStorage.setItem("email",arg.email);
            window.sessionStorage.setItem("customHash",arg.customHash);
          }
          this._snackbar.open("Change Successful!","Ok",{duration: 2000});
        } else {
          this._snackbar.open("Error Encountered. Try again Later.","",{duration: 2000});
        }
      }).catch((err)=>{
        console.log(err);
        this._snackbar.open("Network Error. Check Internet","",{duration: 2000});
      })
      
    } else {
      this._snackbar.open("Enter Correct Email Format","", {duration: 2000});
    }
  }

  changePhone(){
    console.log(this.number);
    if(this.number>7000000000&&this.number<9999999999){

      fetch('http://localhost:5000/api/changephone',{
        method: 'POST',
        body: JSON.stringify({identity: window.localStorage.identity?window.localStorage.identity:window.sessionStorage.identity, id: window.localStorage.id?window.localStorage.id:window.sessionStorage.id, phone: this.number, customHash: window.localStorage.customHash?window.localStorage.customHash:window.sessionStorage.customHash}),
        headers: {
          'Content-Type': 'application/json'
        }
      }).then((response)=>{
        return response.json();
      }).then((arg)=>{
        if(arg.success){
          this.number = Number(arg.phone);
          if(window.localStorage.isLoggedIn){
            window.localStorage.setItem("phone" , arg.phone);
          } else if(window.sessionStorage.isLoggedIn){
            window.sessionStorage.setItem("phone",arg.phone);
          }
          this._snackbar.open("Change Successful!","Ok",{duration: 2000});
        } else {
          this._snackbar.open("Error Encountered. Try Again", "", {duration: 2000});
        }
      }).catch((err)=>{
        console.log(err);
        this._snackbar.open("Network Error. Check Internet","", {duration: 2000});
      });
    } else {
      this._snackbar.open("Enter Correct Number","", {duration: 2000});
    }

  }

  changePassword(){

    if(this.newPassword===this.newRePassword){
      fetch('http://localhost:5000/api/changepass',{
        method: 'POST',
        body: JSON.stringify({identity: window.localStorage.identity?window.localStorage.identity:window.sessionStorage.identity, id: window.localStorage.id?window.localStorage.id:window.sessionStorage.id, oldPassword: this.oldPassword, newPassword: this.newPassword, customHash: window.localStorage.customHash?window.localStorage.customHash:window.sessionStorage.customHash}),
        headers: {
          'Content-Type' : 'application/json'
        }
      }).then((response)=>{
        return response.json();
      }).then((arg)=>{
        if(arg.success){
          this._snackbar.open(arg.remark,"Ok",{duration: 2000});
        } else{
          this._snackbar.open(arg.remark,"Ok",{duration: 2000});
        }
      }).catch((err)=>{
        console.log(err);
        this._snackbar.open("Network Error. Check Internet","",{duration: 2000});
      })
    } else {
      this._snackbar.open("New Password doesn't match. Enter Again.","", {duration: 2000});
    }


  }

  logout(){
    window.localStorage.clear();
    window.sessionStorage.clear();
    this.socketServer.disconnectFromServer();
    this.router.navigateByUrl("/login");
  }



  ngOnInit() {

    if(window.localStorage.isLoggedIn){
      this.name = (window.localStorage.name.split(" "))[0];
      this.email = window.localStorage.email;
      this.number = window.localStorage.phone;
    } else if(window.sessionStorage.isLoggedIn){
      this.name = window.sessionStorage.name;
      this.email = window.sessionStorage.email;
      this.number = window.sessionStorage.phone;
    }




  }

}
