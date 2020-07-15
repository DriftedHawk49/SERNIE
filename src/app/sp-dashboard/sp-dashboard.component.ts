import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestSegregationService } from '../request-segregation.service';

@Component({
  selector: 'app-sp-dashboard',
  templateUrl: './sp-dashboard.component.html',
  styleUrls: ['./sp-dashboard.component.scss']
})
export class SpDashboardComponent implements OnInit {

  private status: boolean;
  private newRequests = [];
  private appointmentsToday = [];
  private appointmentsFuture = [];
  private history = [];
  private loading: boolean = true;
  private noResult: boolean = false;
  private error: boolean = false;

  private ratingURL = {"-1": "../../assets/no-rating.svg",
                      0 : "../../assets/onestar.svg",
                      1 : "../../assets/twostar.svg",
                      2 : "../../assets/threestar.svg",
                      3 : "../../assets/fourstar.svg",
                      4 : "../../assets/fivestar.svg"
                      }

  constructor(private _snackbar: MatSnackBar, private rss: RequestSegregationService) { }

  changeStatus(){
    this.status = !this.status;
    fetch(`http://localhost:5000/api/spchangestatus?id=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id}&status=${this.status}`).then((response)=>{return response.json()}).then((arg)=>{if(arg.success){if(window.localStorage.isLoggedIn){ window.localStorage.online = this.status; console.log(window.localStorage)} else window.sessionStorage.online = this.status} else {this._snackbar.open("Something went wrong!", "Ok", {duration: 2000})}}).catch((err)=>{console.log(err); this._snackbar.open("Server Error", "Ok", {duration: 2000})});
    console.log(this.status);
  }

  fetchRequests(){

    console.log("Fetching Updated Requests from Server")

    fetch(`http://localhost:5000/api/fetchrequests?id=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id}&identity=${window.localStorage.isLoggedIn?window.localStorage.identity:window.sessionStorage.identity}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{

    if(arg.success){

      console.log("Server Responded with Requests");

      if(arg.payload.length){
        console.log("Segregating Requests into Active Requests, Appointments and History");
        this.newRequests = this.rss.freshRequestSP(arg.payload);
        const appointmentArr = this.rss.appointmentSP(arg.payload);
        this.appointmentsToday = this.rss.appointmentSPToday(appointmentArr);
        this.appointmentsFuture = this.rss.appointmentSPFuture(appointmentArr);
        this.history = this.rss.historySP(arg.payload);

        console.log("Changing Date Format for UI");
        this.newRequests = this.rss.changeDateFormat(this.newRequests);
        this.appointmentsToday = this.rss.changeDateFormat(this.appointmentsToday);
        this.appointmentsFuture = this.rss.changeDateFormat(this.appointmentsFuture);
        this.history = this.rss.changeDateFormat(this.history);

        console.log("Show Requests on UI");
        this.loading = false;

      } else {
        this.loading = true;
        this.noResult = true;
      }

    } else {
      this._snackbar.open("Error encountered in fetching requests", "Ok", {duration: 2000});
      this.loading = true;
      this.error = true;
    }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Network Error Occurred.","Ok",{duration: 2000});
      this.loading = true;
      this.error = true;
    })
  }

  acceptRequest(id){
    console.log("Sending GET request to server to accept request")
    fetch(`http://localhost:5000/api/acceptrequest?id=${id}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success){this._snackbar.open("Request Accepted!","Ok",{duration: 2000});console.log("Positive Response received from Server");console.log("Refetching Requests");this.fetchRequests();}else{this._snackbar.open("Server Error. Try Later","Ok",{duration: 2000})}}).catch((err)=>{console.log(err);this._snackbar.open("Network Error. Try Later","Ok",{duration: 2000})});
  }

  rejectRequest(id){
    fetch(`http://localhost:5000/api/rejectrequest?id=${id}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success){this._snackbar.open("Request Rejected!","Ok",{duration: 2000});this.fetchRequests();}else{this._snackbar.open("Server Error. Try Later","Ok",{duration: 2000})}}).catch((err)=>{console.log(err);this._snackbar.open("Network Error. Try Later","Ok",{duration: 2000})});
  }

  markForCompletion(id){
    let identity = window.localStorage.isLoggedIn?window.localStorage.identity:window.sessionStorage.identity;
    fetch(`http://localhost:5000/api/servicecomplete?id=${id}&identity=${identity}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{
      if(arg.success){
        this._snackbar.open("Marked Succesfully!","Ok",{duration: 2000});
        this.fetchRequests();
      }else{
        this._snackbar.open("Server error. Try Later.","Ok",{duration: 2000});}
      }).catch((err)=>{
        console.log(err);
        this._snackbar.open("Network Error. Try Later.","Ok",{duration: 2000});
      });
  }

  ngOnInit() {
    if(window.localStorage.isLoggedIn){
      if(window.localStorage.online=="true"){
        this.status = true;
      } else {
        this.status = false;
      }
    } else {
      if(window.sessionStorage.online=="true"){
        this.status = true;
      } else {
        this.status = false;
      }
    }
    this.fetchRequests();
  }
}
