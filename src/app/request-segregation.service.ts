import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class RequestSegregationService {

  constructor(private _snackbar: MatSnackBar) { }


  changeDateFormat(arr){
    for(let a of arr){
      a.dateCreated = (new Date(a.dateCreated)).toDateString();
      a.dateScheduled = (new Date(a.dateScheduled)).toDateString();
    }

    return arr;
  }


  consumerPending(reqArr){
    let responseArr = [];

    for (let req of reqArr){
      if(req.activeRequest){

        if(req.accepted){
          if(!req.markDoneConsumer){
            responseArr.push(req);
          }
        } else {
          if(!req.rejected){
  
            if((req.dateScheduled>(new Date()).toJSON())||((new Date(req.dateScheduled)).toDateString()==(new Date()).toDateString())){
              responseArr.push(req);
            }
  
          }
  
        }

      }
      
    }

    return responseArr;
  }


  consumerHistory(reqArr){
    let responseArr = [];

    for (let req of reqArr){
      if(req.activeRequest)
      {if(req.accepted){
        if(req.markDoneConsumer){
          responseArr.push(req);
          fetch(`http://localhost:5000/api/deactivaterequest?id=${req.id}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success) console.log("success deactivation")}).catch((err)=>{console.log(err)});
        }
      } else {
        if(req.rejected){
          responseArr.push(req);
        } else {
          if((req.dateScheduled<(new Date()).toJSON())&&((new Date(req.dateScheduled)).toDateString()!=(new Date()).toDateString())){
            responseArr.push(req);
            fetch(`http://localhost:5000/api/rejectrequest?id=${req.id}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success) console.log("success deletion")}).catch((err)=>{console.log(err)});
          }
        }
      }} else {
        responseArr.push(req);
      }
    }

    return responseArr;
  }

  freshRequestSP(reqArr){

    let responseArr = [];

    for(let req of reqArr){
      if(req.activeRequest&&!req.accepted&&!req.rejected&&((req.dateScheduled>(new Date()).toJSON())||((new Date(req.dateScheduled)).toDateString()==(new Date()).toDateString()))){
        responseArr.push(req);
      }
    }

    return responseArr;

  }


  appointmentSP(reqArr){

    let responseArr = [];

    for(let req of reqArr){

      if(req.activeRequest&&req.accepted&&!req.markDoneSP){
        responseArr.push(req);
      }

    }

    return responseArr;

  }

  historySP(reqArr){
    let responseArr = [];

    for(let req of reqArr){

      if(req.activeRequest){

        if(req.accepted){

          if(req.markDoneSP){
            responseArr.push(req);
            fetch(`http://localhost:5000/api/deactivaterequest?id=${req.id}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success) console.log("success deactivation")}).catch((err)=>{console.log(err)});
          }

        } else{

          if(req.rejected){
            responseArr.push(req);
          } else {

            if((req.dateScheduled<(new Date()).toJSON())&&((new Date(req.dateScheduled)).toDateString()!=(new Date()).toDateString())){
              responseArr.push(req);
              fetch(`http://localhost:5000/api/rejectrequest?id=${req.id}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success) console.log("success deletion")}).catch((err)=>{console.log(err)});
            }
          }
        }

      } else {
        responseArr.push(req);
      }

    }

   return responseArr; 
    }


    appointmentSPToday(reqArr){
      let responseArr = [];

      for(let obj of reqArr){
        if((new Date(obj.dateScheduled)).toDateString() == (new Date()).toDateString()){
          responseArr.push(obj);
        }
      }

      return responseArr;
    }

    appointmentSPFuture(reqArr){
      let responseArr = [];

      for(let obj of reqArr){
        if(new Date(obj.dateScheduled).toDateString() != (new Date()).toDateString()){
          responseArr.push(obj);
        }
      }

      return responseArr;
    }


    markCompleted(id,identity){
      fetch(`http://localhost:5000/api/servicecomplete?id=${id}&identity=${identity}`,{method: 'GET'}).then((response)=>{return response.json()}).then((arg)=>{if(arg.success){this._snackbar.open("Marked Succesfully!","Ok",{duration: 2000})}else{this._snackbar.open("Server error. Try Later.","Ok",{duration: 2000})}}).catch((err)=>{console.log(err);this._snackbar.open("Network Error. Try Later.","Ok",{duration: 2000})});
    }


}
