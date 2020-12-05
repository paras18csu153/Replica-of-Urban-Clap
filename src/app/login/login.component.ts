import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import auth from "../../../node_modules/firebase";
import { Router } from '@angular/router';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private aut: AngularFireAuth, private router: Router, private firestor: AngularFirestore) { }
    afAuth = this.aut;
    userExists = false;
    firestore = this.firestor;
    cusRef = this.firestore.collection('Customers');
    proRef = this.firestore.collection('Professionals');

    ngOnInit(): void {
    }

    login() {
        var route = this.router;
        var proRe = this.proRef;
        var cusRe = this.cusRef;
        var email = (<HTMLInputElement>document.getElementById("username")).value + "@gmail.com";
        var password = (<HTMLInputElement>document.getElementById("password")).value;
        var au = this.afAuth;
        this.afAuth.setPersistence(auth.auth.Auth.Persistence.SESSION)
            .then(function () {
                au.signInWithEmailAndPassword(email, password).then(async (user) => {
                    var currentUserId;
                    var currentUser;
                    var snapshot = await cusRe.ref.where("uid", "==", user.user.uid).get();
                    snapshot.forEach((doc) => {
                        currentUserId = doc.id;
                        currentUser = doc.data();
                    });
                    if (currentUser) {
                        route.navigate(['/dashboard-component']);
                    }
                    else {
                        var snapshot1 = await proRe.ref.where("uid", "==", user.user.uid).get();
                        snapshot1.forEach((doc) => {
                            currentUserId = doc.id;
                        });
                        console.log(currentUserId);
                        if (navigator.geolocation) {
                            var geoId = navigator.geolocation.watchPosition(showPosition);
                        }
                        else {
                            console.log("Geolocation is not supported by this browser.");
                        }
                        function showPosition(position) {
                            proRe.ref.doc(currentUserId).update({
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                                timestamp: new Date().getTime()
                            }).then(function () {
                                console.log("Updating!!");
                            }).catch((err) => {
                                navigator.geolocation.clearWatch(geoId);
                                console.log(err);
                                console.log("Stopped!!");
                            });
                        }
                        route.navigate(['/prodashboard-component']);
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
    }
    register() {
        this.router.navigate(['/register-component']);
    }
}
