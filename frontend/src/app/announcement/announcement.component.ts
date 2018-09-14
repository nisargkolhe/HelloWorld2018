import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ExecService, UserService } from '../services/index';
import { User } from "../user";

@Component({
  selector: 'app-checkin',
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.scss']
})

export class AnnouncementComponent implements OnInit {

  currentUser: User;
	model: any = {};
	loading = false;
	returnUrl: string;
	announcements: any = [];

	constructor(
  	private route: ActivatedRoute,
  	private router: Router,
  	private execService: ExecService,
  	private alertService: AlertService,
    private userService: UserService,
  ){
    this.currentUser = userService.loadFromLocalStorage();
  }

	ngOnInit() {
    console.log(this.currentUser);
    if (this.currentUser){
      if(this.currentUser.roles){
        if (this.currentUser.roles.indexOf('exec') !== -1 || this.currentUser.roles.indexOf('admin') !== -1){
        }
        else {
          this.router.navigate(["/home"]);
        }
      }
      else {
        this.router.navigate(["/home"]);
      }
    }
    else {
      this.router.navigate(["/home"]);
    }
	}

  	postAnnouncement() {
	  	this.loading = true;
	  	this.execService.postAnnouncement(this.model.ancm, this.model.title, this.model.badge).subscribe(
	      data => {
	        this.alertService.success(data.message);
	        this.loading = false;
	      },
	      error => {
	        this.alertService.error(error);
	        console.log(error);
	        this.loading = false;
	      });
	    window.location.reload();
	}
}
