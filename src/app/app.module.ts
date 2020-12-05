import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { YourGuardGuard } from './your-guard.guard';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { AngularFireModule } from '@angular/fire';
import { environment } from '../environments/environment';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { LoginComponent } from './login/login.component';
import { RequestComponent } from './request/request.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { LoginorregisterComponent } from './loginorregister/loginorregister.component';
import { ProdashboardComponent } from './prodashboard/prodashboard.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RequestComponent,
    RegisterComponent,
    DashboardComponent,
    LoginorregisterComponent,
    ProdashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule, // Only required for database features
    AngularFireAuthModule, // Only required for auth features,
    AngularFireStorageModule // Only required for storage features
  ],
  providers: [YourGuardGuard],
  bootstrap: [AppComponent]
})
export class AppModule { }
