import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from "@angular/fire/firestore";
import { AngularFireAuth } from "@angular/fire/auth";
import auth from "../../../node_modules/firebase"
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private aut: AngularFireAuth, private route: Router, private firestor: AngularFirestore) { }
  afAuth = this.aut;
  userExists = false;
  firestore = this.firestor;
  cusRef = this.firestore.collection('Customers');
  proRef = this.firestore.collection('Professionals');

  ngOnInit(): void {
    this.visible(1);
  }

  register() {
    var email = "";
    var password = "";
    var pno = 0;
    var type = "";
    var ptype;
    email = (<HTMLInputElement>document.getElementById("username")).value + "@gmail.com";
    password = (<HTMLInputElement>document.getElementById("password")).value;
    pno = parseInt((<HTMLInputElement>document.getElementById("pno")).value);
    type = (<HTMLInputElement>document.getElementById("cars")).value;
    ptype = (<HTMLInputElement>document.getElementById("ptype")).value;
    var au = this.afAuth;
    var cusRef = this.cusRef;
    var proRef = this.proRef;
    var router = this.route;
    // au.currentUser.then((result)=>{
    //   console.log(result);
    // }).catch((err)=>{
    //   console.log(err);
    // });
    this.afAuth.setPersistence(auth.auth.Auth.Persistence.SESSION)
      .then(function () {
        au.createUserWithEmailAndPassword(email, password)
          .then((user) => {
            if (user !== null) {
              var dat = {
                uid: user.user.uid,
                pno: pno,
                type: type,
                ptype: ptype,
                latitude: 0,
                longitude: 0,
                busy: false,
                timestamp: new Date().getTime()
              }
              if (navigator.geolocation) {
                var route = router;
                var cusRe = cusRef;
                var proRe = proRef;
                var data = dat;
                var flag = false;
                if (data.type === "Customer") {
                  navigator.geolocation.getCurrentPosition(showPosition);
                }
                else {
                  var geoId = navigator.geolocation.watchPosition(showPosition);
                }
              } else {
                console.log("Geolocation is not supported by this browser.");
              }
              async function showPosition(position) {
                data.latitude = position.coords.latitude;
                data.longitude = position.coords.longitude;
                if (data.type === "Customer") {
                  await cusRe.add(data).then(function () {
                    route.navigate(['/dashboard-component']);
                  }).catch(function (error) {
                    console.log(error);
                  });
                }
                else {
                  var userid;
                  var user;
                  var snapshot = await proRe.ref.where("uid", "==", data.uid).get();
                  snapshot.forEach((doc) => {
                    userid = doc.id;
                    user = doc.data();
                  });
                  if (!user && !flag) {
                    proRe.add(data).then(function () {
                      route.navigate(['/prodashboard-component']);
                      flag = true;
                    }).catch(function (error) {
                      console.log(error);
                    });
                  }
                  else {
                    proRe.ref.doc(userid).update({
                      latitude: position.coords.latitude,
                      longitude: position.coords.longitude,
                      timestamp: new Date().getTime()
                    }).then(function () {
                      console.log("Updating!!");
                    }).catch(() => {
                      navigator.geolocation.clearWatch(geoId);
                      console.log("Stopped!!");
                    });
                  }
                  if (!user && flag) {
                    navigator.geolocation.clearWatch(geoId);
                  }
                }
              }
            }
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log("Code: " + errorCode + " Message: " + errorMessage);
          });
      })
      .catch(function (error) {
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log("Code: " + errorCode + " Error: " + errorMessage);
      });
    //   var u =await au.currentUser;
    // console.log(u);
    // this.afAuth.onAuthStateChanged((user) => {

    // });
  }
  login() {
    this.route.navigate(['/login-component']);
  }
  visible(i) {
    if (i === 1) {
      document.getElementsByTagName("label")[1].style.visibility = "hidden";
      document.getElementById("ptype").style.visibility = "hidden";
      i=0;
    }
    else {
      if (document.getElementsByTagName("label")[1].style.visibility != "hidden" || (<HTMLInputElement>document.getElementById("cars")).value=="Customer") {
        document.getElementsByTagName("label")[1].style.visibility = "hidden";
        document.getElementById("ptype").style.visibility = "hidden";
      }
      else {
        document.getElementsByTagName("label")[1].style.visibility = "visible";
        document.getElementById("ptype").style.visibility = "visible";
      }
      i=1;
    }
  }
}
