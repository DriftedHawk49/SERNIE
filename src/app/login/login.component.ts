import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private fb: FormBuilder, private router: Router, private _snackbar: MatSnackBar) { }

  private loginForm: FormGroup;

  private timer: number = 2000;


  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      identity: ['',[Validators.required]],
      remember:[false]
    });
  }

  get username(){
    return this.loginForm.get('username');
  }

  get password(){
    return this.loginForm.get('password');
  }

  get identity(){
    return this.loginForm.get('identity');
  }

  get remember(){
    return this.loginForm.get('remember');
  }

  isEmail(email){
    return /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(email);
  }

  isPhone(phone){
    return ((/^[0-9]+$/).test(phone)&&(/^[0-9]{10,10}$/).test(phone));
  }

  login(creds,type:string){
    const url = "http://localhost:5000/api/login/";
    fetch(url,{method: "POST",
               headers: {
                 'Content-Type': 'application/json'
               },
               body: JSON.stringify({username: creds.username, password: creds.password, identity: creds.identity, type: type})  
  }).then((response)=>{
      return response.json();
    }).then((arg)=>{

      if(arg.success&&creds.remember){
        window.localStorage.clear();
        window.localStorage.setItem("isLoggedIn",arg.success);
        window.localStorage.setItem("identity", creds.identity);
        window.localStorage.setItem("id",arg.user.id);
        window.localStorage.setItem("customHash",arg.user.customHash);
        window.localStorage.setItem("name",arg.user.name);
        window.localStorage.setItem("email",arg.user.email);
        window.localStorage.setItem("phone",arg.user.phone);
        window.localStorage.setItem("lat",(JSON.parse(arg.user.location)).lat);
        window.localStorage.setItem("lng",(JSON.parse(arg.user.location)).lng);
        window.localStorage.setItem("zone",arg.user.zone);
        window.localStorage.setItem("pincode", arg.user.pincode);
        window.localStorage.setItem("service",arg.user.service);
        if(creds.identity=="Service_Provider"){
          window.localStorage.setItem("online", arg.user.online);
          if(arg.user.service=="Grocery Shop"){
            window.localStorage.setItem("online", arg.user.online);
            window.localStorage.setItem("shopName", arg.user.shopName);
            window.localStorage.setItem("shopAddress", arg.user.shopAddress);
          }
        }
        this._snackbar.open(arg.remarks,"OK",{duration: this.timer});
        console.log(creds.identity);

        if(creds.identity=="Consumer"){
          this.router.navigateByUrl('/dashboard');
        } else if(creds.identity=="Service_Provider"&&arg.user.service=="Grocery Shop"){
          this.router.navigateByUrl('/grocerydashboard');
        }else{

          this.router.navigateByUrl('/spdashboard');
          
        }
        
        // Insert Routing here when components have been defined.
      } else if(arg.success&&!creds.remember){
        window.sessionStorage.setItem("isLoggedIn",arg.success);
        window.sessionStorage.setItem("id",arg.user.id);
        window.sessionStorage.setItem("identity", creds.identity);
        window.sessionStorage.setItem("customHash",arg.user.customHash);
        window.sessionStorage.setItem("name",arg.user.name);
        window.sessionStorage.setItem("email",arg.user.email);
        window.sessionStorage.setItem("phone",arg.user.phone);
        window.sessionStorage.setItem("lat",(JSON.parse(arg.user.location)).lat);
        window.sessionStorage.setItem("lng",(JSON.parse(arg.user.location)).lng);
        window.sessionStorage.setItem("zone",arg.user.zone);
        window.sessionStorage.setItem("pincode", arg.user.pincode);
        window.sessionStorage.setItem("service",arg.user.service);
        if(creds.identity=="Service_Provider"){
          window.sessionStorage.setItem("online",arg.user.online);
          if(arg.user.service=="Grocery Shop"){
            window.sessionStorage.setItem("online",arg.user.online);
            window.sessionStorage.setItem("shopName", arg.user.shopName);
            window.sessionStorage.setItem("shopAddress", arg.user.shopAddress);
          }
        }

        this._snackbar.open(arg.remarks,"OK",{duration: this.timer});

        if(creds.identity=="Consumer"){
          this.router.navigateByUrl('/dashboard');
        } else if(creds.identity=="Service_Provider"&&arg.user.service=="Grocery Shop"){
          this.router.navigateByUrl('/grocerydashboard');
        }else{

          this.router.navigateByUrl('/spdashboard');
          
        }

      }
      else{
        this._snackbar.open(arg.remarks, "Ok", {duration: this.timer});
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Unknown Error Occurred", "OK", {duration: this.timer});
    });
  }


async submitHandler(){

  if(this.loginForm.valid){
    var formValue = this.loginForm.value;
  if(this.isEmail(formValue.username)){
    this.login(formValue,"email");
  } else if(this.isPhone(formValue.username)){
    this.login(formValue,"phone");
  }
    else {
    this._snackbar.open("Please Enter Correct format or Email or Phone", "Ok",{duration: this.timer});
  }


  } else {
    this._snackbar.open("Fill all the required * fields", "Ok", {duration: this.timer});
  }
  
}

}
