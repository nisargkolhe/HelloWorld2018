import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ExecService, UserService } from '../services/index';
import { User } from "../user";

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})

export class CheckinComponent implements OnInit {

  currentUser: User;
	model: any = {};
	loading = false;
	returnUrl: string;
  checkins: any = [];

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
          this.loadCheckIns();
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

  checkin() {
  	this.loading = true;
  	this.execService.checkin(this.model.email).subscribe(
      data => {
        data = data.json();
        this.alertService.success(data.message);
        this.loadCheckIns();
        this.loading = false;
      },
      error => {
        error = error.json()
        this.alertService.error(error.message);
        this.loading = false;
      });
    window.location.reload();
	}

  loadCheckIns(){
    this.execService.getAllApplications().subscribe(
      result => {
        for (var i = 0; i < result.length; i++){
          this.checkins.push(result[i]["email"]);
        }
        this.addOptions();
      }, error => {
        this.alertService.error(error);
      }
    );
  }

  addOptions(){
    var options = "";
    for (var i = 0; i < this.checkins.length; i++) {
      options += "<option value=\"" + this.checkins[i] + "\"/>";
    }
    document.getElementById('dataList').innerHTML = options;
  }

}
