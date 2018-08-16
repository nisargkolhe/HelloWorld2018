import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';

import { User } from "../user";
import { Application } from '../application';
import { UserService } from "../services/index";
import { AuthService, AlertService, ApplicationService } from "../services/index";

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
    private appService: ApplicationService,
    private route: ActivatedRoute,
    private router: Router) {
    this.currentUser = userService.loadFromLocalStorage();
  }

  ngOnInit() {
    if(this.currentUser.roles && (this.currentUser.roles.indexOf('admin') !== -1 || this.currentUser.roles.indexOf('exec') !== -1)){
      this.appService.getAllApplications()
        .subscribe(
          result => {
            this.applications = result;
            console.log(result);
          }, error => {
            error = error.json()
            this.alertService.error(error.message);
            console.log(error);
          }
      );
    } else {
      this.loadApplication();
    }
  }

  onSelect(app: Application) {
    this.router.navigate(['/applications', app.id]);
  }

  private loadApplication() {
    this.loading = true;
      this.userService.getApplication()
        .subscribe(
          result => {
            this.application = result;
            this.appSubmitted = true;
            this.appLoaded = true;
            console.log(result);
            this.loading = false;
          }, error => {
            if(error.status == 404) {
              //User has not submitted their application yet
              this.appSubmitted = false;
              this.appLoaded = true;
            } else {
              //Something else bad happened
              console.log(error);
              error = error.json()
              //this.alertService.error(error.message);
              this.loading = false;
            }
          }
      );
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
