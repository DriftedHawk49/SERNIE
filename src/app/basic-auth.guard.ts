import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticateService } from './authenticate.service';


@Injectable({
  providedIn: 'root'
})
export class BasicAuthGuard implements CanActivate {

  constructor(private basicAuth: AuthenticateService){}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      console.log("basic auth guard started");
    return this.basicAuth.basicAuth();
  }
  
}
