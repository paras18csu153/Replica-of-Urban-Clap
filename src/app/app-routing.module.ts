import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { from } from 'rxjs';

import { YourGuardGuard } from './your-guard.guard';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProdashboardComponent } from './prodashboard/prodashboard.component';
import { LoginorregisterComponent } from './loginorregister/loginorregister.component';
import { RequestComponent } from './request/request.component';

const routes: Routes = [
  { path: 'loginorregister-component', component: LoginorregisterComponent, canActivate: [YourGuardGuard] },
  { path: 'login-component', component: LoginComponent, canActivate: [YourGuardGuard] },
  { path: 'register-component', component: RegisterComponent, canActivate: [YourGuardGuard] },
  { path: 'dashboard-component', component: DashboardComponent, canActivate: [YourGuardGuard] },
  { path: 'prodashboard-component', component: ProdashboardComponent, canActivate: [YourGuardGuard] },
  { path: 'request-component', component: RequestComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
