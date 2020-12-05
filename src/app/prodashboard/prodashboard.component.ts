import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { element } from 'protractor';

@Component({
  selector: 'app-prodashboard',
  templateUrl: './prodashboard.component.html',
  styleUrls: ['./prodashboard.component.css']
})
export class ProdashboardComponent implements OnInit {

  constructor(private aut: AngularFireAuth, private router: Router, private firestor: AngularFirestore) { }
  afAuth = this.aut;
  userExists = false;
  firestore = this.firestor;
  reqRef = this.firestore.collection('Requests');
  cusRef = this.firestore.collection('Customers');
  proRef = this.firestore.collection('Professionals');

  ngOnInit(): void {
    this.reqHide();
    this.checkRequests();
  }

  async checkRequests() {
    var user = await this.afAuth.currentUser;
    var intervalId = setInterval(async () => {
      var requests = [];
      var snapshot = await this.reqRef.ref.where("uid", "!=", null).get();
      snapshot.forEach((doc) => {
        requests.push(doc.data());
      });
      requests.forEach(async req => {
        if (user.uid === req.professionalsId[req.requestingTo]) {
          clearInterval(intervalId);
          // document.getElementById("request").style.visibility = "visible";
          // document.getElementById("accept").style.visibility = "visible";
          // document.getElementById("decline").style.visibility = "visible";
          var r = window.confirm(req.uid + " wants repairing!! Would you like to do that??");
          if (r == true) {
            var customer;
            var professionalId;
            var re;
            var snapshot1 = await this.cusRef.ref.where("uid", "==", req.uid).get();
            snapshot1.forEach((doc) => {
              customer = doc.data();
            });
            var snapshot2 = await this.proRef.ref.where("uid", "==", user.uid).get();
            snapshot2.forEach((doc) => {
              professionalId = doc.id;
            });
            await this.proRef.ref.doc(professionalId).update({
              busy: true
            });
            var snapshot3 = await this.reqRef.ref.where("uid", "==", req.uid).get();
            snapshot3.forEach((doc) => {
              re = doc.id;
            });
            await this.reqRef.ref.doc(re).update({
              requestAccepted: true,
              requestAcceptedBy: user.uid
            });
            (<HTMLInputElement>document.getElementById("professionalId")).innerHTML = customer.uid;
            (<HTMLInputElement>document.getElementById("professionalpno")).innerHTML = customer.pno;
            (<HTMLInputElement>document.getElementById("professionaltype")).innerHTML = customer.type;
            (<HTMLInputElement>document.getElementById("professionalptype")).innerHTML = customer.ptype;
            (<HTMLInputElement>document.getElementById("professionallatitude")).innerHTML = customer.latitude;
            (<HTMLInputElement>document.getElementById("professionallongitude")).innerHTML = customer.longitude;
            (<HTMLInputElement>document.getElementById("professionalbusy")).innerHTML = customer.busy;
            (<HTMLInputElement>document.getElementById("professionaltimestamp")).innerHTML = new Date(customer.timestamp).toString();
            (document.getElementById("professionalId")).style.visibility = "visible";
            (document.getElementById("professionalpno")).style.visibility = "visible";
            (document.getElementById("professionaltype")).style.visibility = "visible";
            (document.getElementById("professionalptype")).style.visibility = "visible";
            (document.getElementById("professionallatitude")).style.visibility = "visible";
            (document.getElementById("professionallongitude")).style.visibility = "visible";
            (document.getElementById("professionalbusy")).style.visibility = "visible";
            (document.getElementById("professionaltimestamp")).style.visibility = "visible";
            document.getElementById("finish").style.visibility = "visible";
          }
          else {
            var requ;
            var snapshot3 = await this.reqRef.ref.where("uid", "==", req.uid).get();
            snapshot3.forEach((doc) => {
              requ = doc.id;
            });
            var rt = req.requestingTo + 1;
            await this.reqRef.ref.doc(requ).update({
              requestingTo: rt
            });
            this.checkRequests();
          }
        }
      });
      console.log("CHECKED!!");
    }, 2500)
  }

  reqHide() {
    //   document.getElementById("request").style.visibility = "hidden";
    (document.getElementById("professionalId")).style.visibility = "hidden";
    (document.getElementById("professionalpno")).style.visibility = "hidden";
    (document.getElementById("professionaltype")).style.visibility = "hidden";
    (document.getElementById("professionalptype")).style.visibility = "hidden";
    (document.getElementById("professionallatitude")).style.visibility = "hidden";
    (document.getElementById("professionallongitude")).style.visibility = "hidden";
    (document.getElementById("professionalbusy")).style.visibility = "hidden";
    (document.getElementById("professionaltimestamp")).style.visibility = "hidden";
    document.getElementById("finish").style.visibility = "hidden";
    //   document.getElementById("decline").style.visibility = "hidden";
  }

  signout() {
    this.afAuth.signOut().then(() => {
      console.log("Signed OUT SUCCESSFULLY!!");
      this.router.navigate(["/login-component"]);
    }).catch((err) => {
      console.log(err);
    });
  }

  async finish() {
    var user = await this.afAuth.currentUser;
    var professionalId;
    var snapshot2 = await this.proRef.ref.where("uid", "==", user.uid).get();
    snapshot2.forEach((doc) => {
      professionalId = doc.id;
    });
    await this.proRef.ref.doc(professionalId).update({
      busy: false
    });
    this.reqHide();
    var requestReference = await this.reqRef.ref.where("requestAcceptedBy", "==", user.uid).get();
    var requestId;
    requestReference.forEach((doc) => {
      requestId = doc.id
    });
    console.log(requestId);
    await this.reqRef.ref.doc(requestId).delete();
    this.checkRequests();
  }
}
