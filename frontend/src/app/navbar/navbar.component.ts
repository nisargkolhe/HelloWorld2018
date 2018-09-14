import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
  inputs: ['showButton', 'dayof']
})
export class NavbarComponent implements OnInit {

  showButton: boolean = false;
  dayof: boolean = false;
  loggedIn: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    let token = localStorage.getItem('token');
    if (token) {
      this.loggedIn = true;
    }
  }

}
