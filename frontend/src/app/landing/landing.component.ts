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
  announcements: any = [];

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
    this.userLoadAnnouncements();
  }

  userLoadAnnouncements(){
      this.userService.getAnnouncements().subscribe(
          result => {
            this.announcements = result.sort((a,b) => {
              return new Date(a.time) < new Date(b.time);
            });
          }, error => {
            this.alertService.error(error);
          }
      );
  }

}
