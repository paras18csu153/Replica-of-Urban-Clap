import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { Router } from '@angular/router';
import { from } from 'rxjs';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  constructor(private aut: AngularFireAuth, private router: Router) { }
  afAuth = this.aut;
  ngOnInit(): void {
  }

  signout() {
    this.afAuth.signOut().then(()=>{
      console.log("Signed OUT SUCCESSFULLY!!");
      this.router.navigate(["/login-component"]);
    }).catch((err)=>{
      console.log(err);
    });
  }

  generateRequests(){
    this.router.navigate(["/request-component"]);
  }
}
