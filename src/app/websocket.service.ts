import { Injectable } from '@angular/core';
import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import * as Rx from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';


@Injectable({
  providedIn: 'root'
})
export class WebsocketService {

  private socket;

  constructor(private _snackbar: MatSnackBar) { }

  connect(): Rx.Subject<MessageEvent>{

    this.socket = io('http://localhost:3000');

    let observable = new Observable(observer=>{

      this.socket.on('response', (data)=>{
        console.log("Response Event fired from Socket Server");
        observer.next(data);
      });
      return ()=>{this.socket.disconnect();}
    });

    let observer = {
      next: (obj)=>{
        if(obj.evt=="remove"){
          this.socket.close();
        }else{
          this.socket.emit(obj.evt, JSON.stringify(obj.data));
        }
        
      }
    };

    return Rx.Subject.create(observer, observable);
  }

}
