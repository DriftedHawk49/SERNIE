import { Component, OnInit, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  private initialCheckup: FormGroup;

  private validatedEmail: string = null;

  private isFoundEmail: boolean = false;

  private isValidatedEmail: boolean = false;

  private displayMessage: string = "Don't Worry ! We're here to help";

  private otpField: boolean = true;

  private timer: number = 3000;

  private validateURL: string = "http://localhost:5000/api/forgotpassword/validate";

  constructor(private fb: FormBuilder, private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.initialCheckup = this.fb.group({
      email: ['',[Validators.required, Validators.email]],
      identity: ['',[Validators.required]],
      password: ['',[Validators.required,Validators.minLength(6)]],
      rePassword: ['',[Validators.required,Validators.minLength(6)]],
      otp: ['',Validators.maxLength(6)],
    });
  }

  get email(){
    return this.initialCheckup.get('email');
  }

  get identity(){
    return this.initialCheckup.get('identity');
  }

  get password(){
    return this.initialCheckup.get('password');
  }

  get rePassword(){
    return this.initialCheckup.get('rePassword');
  }

  private passwordValidator(p1:String, p2: String){
    if(p1===p2){
      return true;
    } else return false;
  }

  findEmail(obj){
    const newURL = this.validateURL+`?email=${obj.email}&identity=${obj.identity}`;
    fetch(newURL, {
      method: "GET"      
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{
      console.log(arg);
      console.log("return kia mein");

      if(arg.found){
        this.isFoundEmail = true;
        this.displayMessage = "We Found you! and sent you a mail with OTP. Check your mail, and enter it here.";
      }
    }).catch((err)=>{
      console.log(err);
      this._snackBar.open("Password Changed ! You can Login now!", "OK", {duration: this.timer});
      this.router.navigateByUrl("/login");
    })
  }

  otpVerify(otp,email,identity){

    var otpURL = "http://localhost:5000/api/forgotpassword/otpverification"+`?otp=${otp}&email=${email}&identity=${identity}`;

    fetch(otpURL,{
      method: "GET"
    }).then((response)=>{
      console.log(response);
      return response.json();
    }).then((arg)=>{
      console.log(arg);
      if(arg.match){
        console.log("Match Found");
        this.displayMessage = "We're convinced! Go ahead and change your password.";
        this.isValidatedEmail = true;
        this.otpField = false;
        this.validatedEmail = this.initialCheckup.value.email;
      } else {
        this._snackBar.open("Enter Correct OTP Please", "Got it", {duration: this.timer});
      }
    });
  }

  changePassword(obj){
    fetch(this.validateURL,{
      method: 'POST',
      body: JSON.stringify(obj),
      headers: {
        'Content-Type': "application/json"
      }
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{
      if(arg.success){
        this._snackBar.open("Password Changed ! You can Login now!", "OK", {duration: this.timer});
        this.router.navigateByUrl('/login');
      }
    }).catch((err)=>{
      this._snackBar.open("Unknown Error Occurred.", "Ok", {duration: this.timer});
      console.log(err);
    })
  }


  async submitHandler(){
    if(!this.isFoundEmail){
      console.log("Clicked Submit");
      let formValue = this.initialCheckup.value;
      console.log(formValue);
      let forValidation : {email: string, identity: string} = {
        email: formValue.email,
        identity: formValue.identity
      };
      console.log(forValidation);
      if(forValidation.email==""||forValidation.identity==""){
      } else {
        console.log("I'm in");
        this.findEmail(forValidation); 
      }
    } else if(!this.isValidatedEmail){
      console.log(this.initialCheckup.value);
      let otp = this.initialCheckup.value.otp;
      this.otpVerify(otp,this.initialCheckup.value.email, this.initialCheckup.value.identity);

    } else if(this.isFoundEmail&&this.isValidatedEmail){
      let passObj = {
        pass: this.initialCheckup.value.password,
        rePass: this.initialCheckup.value.rePassword
      }
      if(passObj.pass==""||passObj.rePass==""){

      } else if(this.passwordValidator(passObj.pass,passObj.rePass)){

        let payload = {
          email: this.initialCheckup.value.email,
          identity: this.initialCheckup.value.identity,
          password: this.initialCheckup.value.password
        }
        this.changePassword(payload);
      } else {
        this._snackBar.open("Passwords don't match! Re-Enter", "Ok", {duration: this.timer});
      }
    }

    
  }



}
