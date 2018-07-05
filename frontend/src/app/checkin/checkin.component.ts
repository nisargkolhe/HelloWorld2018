import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertService, AuthService } from '../services/index';

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
    	private authService: AuthService,
    	private alertService: AlertService) { }

  	ngOnInit() {
    	// reset login status
    	this.authService.logout();
    	// get return url from route parameters or default to '/'
    	this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/home';
  	}

    checkin() {
    	this.loading = true;
    	this.authService.checkin(this.model.email).subscribe(
      		data => {
        	this.router.navigate([this.returnUrl]);
      	},
      	error => {
        	error = error.json()
        	this.alertService.error(error.message);
        	this.loading = false;
    	});
  	}
}
