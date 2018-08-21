import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ExecService, UserService } from '../services/index';
import { User } from "../user";

@Component({
  selector: 'app-checkin',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})

export class AnnouncementsComponent implements OnInit {

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
	    if (!this.currentUser){
		    this.userLoadAnnouncements();
		}
	    else if (this.currentUser["exec"] != -1 || this.currentUser["admin"] != -1){
	    	this.execLoadAnnouncements();
	    }
	    else {
	    	this.userLoadAnnouncements();
	    }
	}

	userLoadAnnouncements(){
	    this.userService.getAnnouncements().subscribe(
	      	result => {
	        	for (var i = 0; i < result.length; i++){
	        		var ancm = result[i]["ancm"];
	        		var date = result[i]["date"];
	        		var time = result[i]["time"];
	          		this.announcements.unshift(ancm + "<br>" + "Posted at " + time + " on " + date);
	        	}
	        	this.addToTable();
	      	}, error => {
	        	this.alertService.error(error);
	      	}
	    );
	}

	execLoadAnnouncements(){
	    this.execService.getAnnouncements().subscribe(
	      	result => {
	        	for (var i = 0; i < result.length; i++){
	        		var ancm = result[i]["ancm"];
	        		var date = result[i]["date"];
	        		var time = result[i]["time"];
	          		this.announcements.unshift(ancm + "<br>" + "Posted at " + time + " on " + date);
	        	}
	        	this.addToTable();
	      	}, error => {
	        	this.alertService.error(error);
	      	}
	    );
	}

	addToTable(){
    	var table = "";
    	if (this.announcements.length == 0){
    		document.getElementById('ancmList').innerHTML = "<p>No Announcements Yet!</p>";
    	}
    	else {
    		for (var i = 0; i < this.announcements.length; i++) {
      			table += "<p>" + this.announcements[i] + "</p>"
    		}
    		document.getElementById('ancmList').innerHTML = table;
    	}
  	}
}
