import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { User } from "../user";
import { Application } from '../application';
import { UserService } from "../services/index";
import { AuthService, AlertService } from "../services/index";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  currentUser: User;
  users: User[] = [];
  applications: Application[] = [];
  application: Application;
  appSubmitted = false;
  appLoaded = false;
  loading = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private alertService: AlertService,
    private route: ActivatedRoute,
    private router: Router) {
    this.currentUser = userService.loadFromLocalStorage();
  }

  ngOnInit() {
  }

  private resendVerificationEmail() {
    this.loading = true;
    this.authService.resendVerificationEmail()
    .subscribe(
      result => {
        this.alertService.success("Please check your email for a link!");
        console.log(result);
        this.loading = false;
      }, error => {
        this.alertService.error(error.message);
        this.loading = false;
      }
      );
  }

  public getStatusString(): object {
    switch(this.application.status) {
      case "pending":
      return {title: "Application Submitted", description: "We've got your application!\nYou can still make changes if needed."};
      case "accepted":
      return {title: "Accepted!", description: "You're in!\nWe're so excited to see you at Hello World!"};
      case "waitlisted":
      return {title: "Waitlisted", description: "Hang tight! We received more applications than expected, so we'll be in touch as we get closer to the event."};
      case "rejected":
      return {title: "Rejected", description: "Unfortunately we aren't able to offer you a spot at Hello World."};
      default:
      return {title: "Pending", description: ""};
    }
  }

}
