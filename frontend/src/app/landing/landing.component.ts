import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from '../services/index';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {
  public isLoggedIn: boolean;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserService) { }

  ngOnInit() {
    if(this.userService.loadFromLocalStorage()){
      //User is logged in
      this.isLoggedIn = true;
    } else {
      //User is not logged in
      this.isLoggedIn = false;
    }
  }

}
