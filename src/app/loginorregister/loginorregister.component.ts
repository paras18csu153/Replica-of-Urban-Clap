import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-loginorregister',
  templateUrl: './loginorregister.component.html',
  styleUrls: ['./loginorregister.component.css']
})
export class LoginorregisterComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  login() {
    this.router.navigate(['/login-component']);
  }
  register() {
    this.router.navigate(['/register-component']);
  }
}
