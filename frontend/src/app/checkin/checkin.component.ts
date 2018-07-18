import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, ExecService } from '../services/index';

@Component({
  selector: 'app-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})

export class CheckinComponent implements OnInit {

	model: any = {};
	loading = false;
	returnUrl: string;
  checkins: any = [];

	constructor(
  	private route: ActivatedRoute,
  	private router: Router,
  	private execService: ExecService,
  	private alertService: AlertService) { }

	ngOnInit() {
    this.loadCheckIns();
	}

  checkin() {
  	this.loading = true;
  	this.execService.checkin(this.model.email).subscribe(
    	data => {
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
