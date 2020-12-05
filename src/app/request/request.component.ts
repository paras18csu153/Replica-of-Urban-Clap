import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from "@angular/fire/auth";
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';

@Component({
  selector: 'app-request',
  templateUrl: './request.component.html',
  styleUrls: ['./request.component.css']
})
export class RequestComponent implements OnInit {

  constructor(private aut: AngularFireAuth, private router: Router, private firestor: AngularFirestore) { }
  afAuth = this.aut;
  firestore = this.firestor;
  cusRef = this.firestore.collection('Customers');
  proRef = this.firestore.collection('Professionals');
  reqRef = this.firestore.collection('Requests');

  ngOnInit(): void {
  }

  async generateRequests(i) {
    this.afAuth.currentUser.then(async (user) => {
      var currentUser;
      var snapshot0 = await this.cusRef.ref.where("uid", "==", user.uid).get();
      snapshot0.forEach((doc) => {
        currentUser = doc.data();
      });
      console.log("Printing");
      var professionals = [];
      var newprofessionals = [];
      var distances = [];
      if (i == 1) {
        var snapshot = await this.proRef.ref.where("ptype", "==", "House Repair").get();
        snapshot.forEach((doc) => {
          professionals.push(doc.data());
        });
      }
      else {
        var snapshot1 = await this.proRef.ref.where("ptype", "==", "Electric Repair").get();
        snapshot1.forEach((doc) => {
          professionals.push(doc.data());
        });
      }
      for (var j = 0; j < professionals.length; j++) {
        if (professionals[j].busy) {
          for (var k = j; k < professionals.length - 1; k++) {
            professionals[k] = professionals[k + 1];
          }
        }
      }
      for (var j = 0; j < professionals.length; j++) {
        console.log(professionals[j]);
        distances.push(this.distance(currentUser.latitude, currentUser.longitude, professionals[j].latitude, professionals[j].longitude));
      }
      var newDistances = distances;
      newDistances.sort(function (a, b) { return a - b });
      for (var j = 0; j < newDistances.length - 1; j++) {
        var l = distances.indexOf(newDistances[j]);
        console.log(j);
        console.log(newprofessionals.indexOf(professionals[l].uid));
        if (newprofessionals.indexOf(professionals[l].uid) == -1) {
          newprofessionals[j] = professionals[l].uid;
          if (newDistances[j + 1] > 7.5) {
            break;
          }
        }
      }
      if (newDistances[newDistances.length - 1] < 7.5 && newprofessionals.indexOf(professionals[l].uid) == -1) {
        var l = distances.indexOf(newDistances[j]);
        newprofessionals[j] = professionals[l].uid;
      }
      newprofessionals.forEach(element => {
        console.log(element);
      });
      var data = {
        uid: currentUser.uid,
        professionalsId: newprofessionals,
        requestAccepted: false,
        requestingTo: 0,
        requestAcceptedBy: ""
      }
      var checkRequestref = await this.reqRef.ref.where("uid", "==", data.uid).get();
      var checkRequest;
      checkRequestref.forEach((doc) => {
        checkRequest = doc.data();
      });
      if (!checkRequest) {
        var count = 0;
        var reques = await this.reqRef.add(data);
        (<HTMLInputElement>document.getElementById("result")).innerHTML = "PLEASE WAIT WHILE WE REQUEST TO THE NEARBY PROFESSIONALS!!";
        var requestId = reques.id;
        var intervalid = setInterval(async () => {
          var requestref = await this.reqRef.ref.doc(requestId).get();
          var request;
          request = requestref.data();
          count = count + 2.5;
          if (request.requestAccepted || count == 300) {
            if (count == 300) {
              await this.reqRef.ref.doc(requestId).delete();
              (<HTMLInputElement>document.getElementById("result")).innerHTML = "CURRENTLY NO PROFESSIONALS FOUND!!";
              document.getElementById("result").style.color = "red";
            }
            else {
              var professionalref = await this.proRef.ref.where("uid", "==", request.professionalsId[request.requestingTo]).get();
              var professional;
              professionalref.forEach((doc) => {
                professional = doc.data();
              });
              (<HTMLInputElement>document.getElementById("professionalId")).innerHTML = professional.uid;
              (<HTMLInputElement>document.getElementById("professionalpno")).innerHTML = professional.pno;
              (<HTMLInputElement>document.getElementById("professionaltype")).innerHTML = professional.type;
              (<HTMLInputElement>document.getElementById("professionalptype")).innerHTML = professional.ptype;
              (<HTMLInputElement>document.getElementById("professionallatitude")).innerHTML = professional.latitude;
              (<HTMLInputElement>document.getElementById("professionallongitude")).innerHTML = professional.longitude;
              (<HTMLInputElement>document.getElementById("professionalbusy")).innerHTML = professional.busy;
              (<HTMLInputElement>document.getElementById("professionaltimestamp")).innerHTML = new Date(professional.timestamp).toString();
              (<HTMLInputElement>document.getElementById("result")).innerHTML = "WE GOT A PROFESSIONAL FOR YOU!!";
              document.getElementById("result").style.color = "green";
              setTimeout(() => {
                (<HTMLInputElement>document.getElementById("professionalId")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionalpno")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionaltype")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionalptype")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionallatitude")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionallongitude")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionalbusy")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("professionaltimestamp")).innerHTML = "";
                (<HTMLInputElement>document.getElementById("result")).innerHTML = "";
              }, 300000);
            }
            clearInterval(intervalid);
          }
        }, 2500);
        console.log("Printing Ended");
      }
    }).catch((err) => {
      console.log(err);
    });
  }
  back() {
    this.router.navigate(["/dashboard-component"]);
  }

  signout() {
    this.afAuth.signOut().then(() => {
      console.log("Signed OUT SUCCESSFULLY!!");
      this.router.navigate(["/login-component"]);
    }).catch((err) => {
      console.log(err);
    });
  }

  distance(lat1, lon1, lat2, lon2) {
    if ((lat1 == lat2) && (lon1 == lon2)) {
      return 0;
    } else {
      var radlat1 = Math.PI * lat1 / 180;
      var radlat2 = Math.PI * lat2 / 180;
      var theta = lon1 - lon2;
      var radtheta = Math.PI * theta / 180;
      var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = dist * 180 / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344
      return dist;
    }
  }
}
