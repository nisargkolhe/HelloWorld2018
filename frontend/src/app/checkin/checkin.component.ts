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

  	constructor(
    	private route: ActivatedRoute,
    	private router: Router,
    	private execService: ExecService,
    	private alertService: AlertService) { }

  	ngOnInit() {
  	}

    checkin() {
    	this.loading = true;
    	this.execService.checkin(this.model.email).subscribe(
      		data => {
          this.loading = false;
          window.location.reload();
      	},
      	error => {
        	error = error.json()
        	this.alertService.error(error.message);
        	this.loading = false;
    	});
      window.location.reload();
  	}
}
