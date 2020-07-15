import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RequestSegregationService } from 'src/app/request-segregation.service';


@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {

  constructor(private _snackbar: MatSnackBar, private rss: RequestSegregationService) { }

  private pendingRequests = [];
  private historyRequests = [];
  private loading: boolean = true;
  private error: boolean = false;
  private noResult: boolean = false;

  private ratingSRC = {"-1": "../../../assets/no-rating.svg",
                       0 : "../../../assets/onestar.svg",
                       1 : "../../../assets/twostar.svg",
                       2: "../../../assets/threestar.svg",
                       3 : "../../../assets/fourstar.svg",
                       4 : "../../../assets/fivestar.svg"};
  // private rating = [0,1,2,3,4];


  




  fetchRequests(){

    fetch(`http://localhost:5000/api/fetchrequests?identity=${window.localStorage.isLoggedIn?window.localStorage.identity:window.sessionStorage.identity}&id=${window.localStorage.isLoggedIn?window.localStorage.id:window.sessionStorage.id} `,{
      method: "GET",
    }).then((response)=>{
      return response.json();
    }).then((arg)=>{
      if(arg.success){
        console.log("response received");
        console.log(arg);
        if(arg.payload.length){

          arg.payload = (arg.payload.map((x)=>{if(x.rating==null&&!x.rejected){x.ratingAllowance = true;console.log(x)}else{x.ratingAllowance = false;}return x}));
          
          this.pendingRequests = this.rss.consumerPending(arg.payload);
          this.historyRequests = this.rss.consumerHistory(arg.payload);

          this.pendingRequests = this.rss.changeDateFormat(this.pendingRequests);
          this.historyRequests = this.rss.changeDateFormat(this.historyRequests);

          this.loading = false;
        } else {
          this.loading = false;
          this.noResult = true;
        }
        
      } else{
        this.error = true;
        this._snackbar.open("Server Error. Refresh the Page.", "Ok", {duration: 2000});
      }
    }).catch((err)=>{
      console.log(err);
      this._snackbar.open("Network Error Encountered.", "Ok", {duration: 2000});
    });


  }

  rate(rating,id){
    console.log(id);
    console.log(Number(rating));
    const identity = window.localStorage.isLoggedIn?window.localStorage.identity:window.sessionStorage.identity;
    fetch(`http://localhost:5000/api/servicecomplete?id=${id}&rating=${Number(rating)}&identity=${identity}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{console.log(arg); if(arg.success){this._snackbar.open("Rating succcessful!","Ok",{duration: 2000});}else{this._snackbar.open("Server Error Occurred","Ok",{duration: 2000})}}).catch((err)=>{console.log(err);this._snackbar.open("Network Error Occurred","Ok",{duration: 2000})});
    this.fetchRequests();
  
  }



  ngOnInit() {
    this.fetchRequests();
  }

}
