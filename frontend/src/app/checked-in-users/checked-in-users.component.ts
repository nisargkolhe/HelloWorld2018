import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ExecService, UserService } from '../services/index';
import { User } from "../user";

@Component({
  selector: 'app-checked-in-users',
  templateUrl: './checked-in-users.component.html',
  styleUrls: ['./checked-in-users.component.scss']
})

export class CheckedInUsersComponent implements OnInit {

  currentUser: User;
	model: any = {};
	loading = false;
	returnUrl: string;
  	checkins: any = [];
  	names: any = [];

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

  loadCheckIns(){
    this.execService.getCheckedIn().subscribe(
      result => {
        for (var i = 0; i < result.length; i++){
          this.checkins.push(result[i]["email"]);
          this.names.push(result[i]["firstname"] + " " + result[i]["lastname"]);
        }
        this.addToList();
      }, error => {
        this.alertService.error(error);
      }
    );
  }

  addToList(){
    var options = "<p>";
    for (var i = 0; i < this.checkins.length; i++) {
      options += this.names[i] + "<br>" + this.checkins[i] + "<br><br>";
    }
    options += "</p>";
    document.getElementById('userList').innerHTML = options;
  }

}