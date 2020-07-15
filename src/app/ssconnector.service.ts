import { Injectable } from '@angular/core';
import { WebsocketService } from './websocket.service';
import { Observable,Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SsconnectorService {

  messages:Subject<any>;

  constructor(private wsService: WebsocketService) {
    this.messages = <Subject<any>>wsService.connect();
   }

   disconnectFromServer(){
     this.messages.next({evt:"remove"})
   }

   connectToServer(msg){
     console.log(msg);
     this.messages.next({evt:"CON", data: msg});
   }

   sendToServer(msg){
     this.messages.next({evt:"message", data: JSON.stringify(msg)});
   }
}
