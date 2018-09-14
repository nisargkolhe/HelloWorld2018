import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SwPush, SwUpdate } from "@angular/service-worker";
import { UserService, AlertService } from './services/index';

@Component({
	moduleId: module.id,
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.scss'],
	encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
	show: boolean;
	public isLoggedIn: boolean;
	readonly VAPID_PUBLIC_KEY = "BE8kp7w24mEcUUtRlQwo9K-FvVrpX9sNQ9NUG-QliKf0wmA2cmM1Gl5szfGV30xt47MhQbUgQJL95wlntxaYwD0";
	title = 'Hello World';

	constructor(
		private swPush: SwPush,
		private userService: UserService,
		private alertService: AlertService
		) {
		this.show = true;
	}
	ngOnInit() {
    if(this.userService.loadFromLocalStorage()){
      //User is logged in
      this.isLoggedIn = true;
    } else {
      //User is not logged in
      this.isLoggedIn = false;
    }
		this.subscribeToNotifications();
  }

	subscribeToNotifications() {
      this.swPush.requestSubscription({
          serverPublicKey: this.VAPID_PUBLIC_KEY
      })
      .then(sub => this.alertService.addPushSubscriber(sub).subscribe())
      .catch(err => console.error("Could not subscribe to notifications", err));
  }
}
