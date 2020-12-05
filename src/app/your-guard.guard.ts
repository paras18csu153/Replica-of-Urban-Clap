import { Injectable } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class YourGuardGuard implements CanActivate {
  routeURL: string;
  constructor(private aut: AngularFireAuth, private router: Router) {
    this.routeURL = this.router.url;
  }
  afAuth = this.aut;
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return new Promise((resolve, reject) => {
      this.afAuth.currentUser.then((user) => {
        console.log(user);
        this.routeURL = this.router.url;
        if (user === null) {
          if (next.url.toString() === "" || next.url.toString() === "loginorregister-component" || next.url.toString() === "login-component" || next.url.toString() === "register-component") {
            return resolve(true);
          }
          else {
            this.routeURL = '/login-component';
            this.router.navigate(['/login-component']);
            return resolve(false);
          }
        } else {
          if (next.url.toString() === "" || next.url.toString() === "loginorregister-component" || next.url.toString() === "login-component" || next.url.toString() === "register-component") {
            if (this.routeURL === "/dashboard-component" || this.routeURL === "/request-component") {
              this.routeURL = '/dashboard-component';
              this.router.navigate(['/dashboard-component']);
              return resolve(false);
            }
            else {
              this.routeURL = '/prodashboard-component';
              this.router.navigate(['/prodashboard-component']);
              return resolve(false);
            }
          }
          else {
            return resolve(true);
          }
        }
      });
    });
  }
}
